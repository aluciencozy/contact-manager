<?php
// handle POST /login

// start login session. we will handle session cookies on the server side
session_start();

// tell the frontend that our response will be JSON to match our frontend definition
header('Content-Type: application/json; charset=utf-8');

// get the variables from config/database.php and the helper function from helpers/response.php
// __DIR__ puts in the current directory and the '.' is string concatenation
require __DIR__ . "/config/database.php";
require __DIR__ . "/helpers/response.php";

// get the user data from the frontend and decode the JSON into an array
// this commit assumes we are only using the username to login and that the username has a unique constraint on the database
$user_data = json_decode(file_get_contents("php://input"), true);

// get the username and password from the decoded array
$username = $user_data["username"] ?? "";
$password = $user_data["password"] ?? "";

// if username or password not set, return a 400 bad request
if ($username === "" || $password === "") {
    sendResponse(400, false, "Invalid username or password");
}

// use the database.php variables to create a connection to the database
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    sendResponse(500, false, "Error connecting to the database");
}

// find the user by username
// this might need to be updated to handle finding emails and also maybe the column names are incorrect. confirmation from database side is needed
$sql = "select id, username, password_hash from Users where username = ? limit 1";

// create the prepared statement to prevent SQL injection
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username); // place $username where the '?' is
$stmt->execute(); // execute the query

// get the result from the SQL query into an associative array
$user = $stmt->get_result()->fetch_assoc();

$stmt->close();
$conn->close();

// if the user was not found or password is incorrect, return 401 unauthorized
if (!$user || !password_verify($password, $user["password_hash"])) {
    sendResponse(401, false, "Invalid username or password");
}

// prevent session fixation after successful login
session_regenerate_id(true);

// store logged-in user on server
$_SESSION["user_id"] = $user["id"];

// send 200 success response
sendResponse(200, true, "Successfully logged in");
