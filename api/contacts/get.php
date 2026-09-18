<?php
// Handle GET /contacts/get.php?search=search-term

session_start();

header("Content-Type: application/json; charset=utf-8");

require __DIR__ . "/../config/database.php";
require __DIR__ . "/../helpers/response.php";

if (($_SERVER["REQUEST_METHOD"] ?? "GET") !== "GET") {
    header("Allow: GET");
    sendResponse(405, false, "Method not allowed", ["contacts" => []]);
}

// The user comes only from the server-side session. Never trust a user ID
// supplied in the URL because that could expose somebody else's contacts.
$userId = filter_var(
    $_SESSION["user_id"] ?? null,
    FILTER_VALIDATE_INT,
    ["options" => ["min_range" => 1]]
);

if ($userId === false) {
    sendResponse(401, false, "You must be logged in", ["contacts" => []]);
}

$searchValue = $_GET["search"] ?? "";

if (!is_string($searchValue)) {
    sendResponse(400, false, "Search must be text", ["contacts" => []]);
}

$search = trim($searchValue);

try {
    $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

    if ($conn->connect_error) {
        sendResponse(500, false, "Error connecting to the database", ["contacts" => []]);
    }

    if (!$conn->set_charset("utf8mb4")) {
        sendResponse(500, false, "Error configuring the database connection", ["contacts" => []]);
    }

    $sql = "SELECT id, first_name, last_name, email, phone, created_at, updated_at
            FROM Contacts
            WHERE user_id = ?";

    if ($search !== "") {
        $sql .= " AND (
                    first_name LIKE ?
                    OR last_name LIKE ?
                    OR email LIKE ?
                    OR phone LIKE ?
                  )";
    }

    $sql .= " ORDER BY last_name ASC, first_name ASC, id ASC";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        sendResponse(500, false, "Error retrieving contacts", ["contacts" => []]);
    }

    if ($search === "") {
        $stmt->bind_param("i", $userId);
    } else {
        $searchPattern = "%" . $search . "%";
        $stmt->bind_param(
            "issss",
            $userId,
            $searchPattern,
            $searchPattern,
            $searchPattern,
            $searchPattern
        );
    }

    if (!$stmt->execute()) {
        sendResponse(500, false, "Error retrieving contacts", ["contacts" => []]);
    }

    $result = $stmt->get_result();
    $contacts = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    $conn->close();

    sendResponse(200, true, "Contacts retrieved successfully", [
        "contacts" => $contacts
    ]);
} catch (Throwable $error) {
    error_log("Contact search failed: " . $error->getMessage());
    sendResponse(500, false, "Error retrieving contacts", ["contacts" => []]);
}
