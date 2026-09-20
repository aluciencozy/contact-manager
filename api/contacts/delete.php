<?php 
// delete contacts logic
session_start();

//inform frontend of result type
header('Content-Type: application/json; charset=utf-8');

//get variables from database and response helper
require __DIR__ . "/config/database.php";
require __DIR__ . "/helpers/response.php";

//decodes input to use
$contact_data = json_decode(file_get_contents("php://input"), true);

/*not sure exactly how you want the buttons to work so for now 
    i designed them off of the idea of the button passing the id of the user*/
$id=$contact_data["id"] ?? "";

$userId = filter_var(
    $_SESSION["user_id"] ?? null,
    FILTER_VALIDATE_INT,
    ["options" => ["min_range" => 1]]
);

if ($userId === false) {
    sendResponse(401, false, "You must be logged in", ["contacts" => []]);
}

//connect to database
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if($conn->connect_error){
    sendResponse(500, false, "Connection failed");
}

//navigates to the row of the given id and deletes it
$stmt = $conn->prepare("DELETE FROM Contacts WHERE id=? AND user_id = ?");
$stmt->bind_param("ii", $id, $userId); 

//checks if the code properly ran
if(!$stmt->execute()){
    sendResponse(500, false, "failed to delete contact");
}
else sendResponse(200, true, "contact successfullly deleted");

$stmt->close();
$conn->close();
