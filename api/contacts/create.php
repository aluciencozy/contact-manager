<?php 
// create contacts logic
session_start();

//inform frontend of result type
header('Content-Type: application/json; charset=utf-8');

//get variables from database and response helper
require __DIR__ . "/config/database.php";
require __DIR__ . "/helpers/response.php";

//decodes input to use
$user_data = json_decode(file_get_contents("php://input"), true);

$first_name=$user_data["first_name"] ?? "";
$last_name=$user_data["last_name"] ?? "";
$email=$user_data["email"] ?? "";
$phone=$user_data["phone"] ?? "";
$user_id=$_SESSION["user_id"];


//check if variables are valid
if($first_name=="" || strlen($first_name)>100){
    sendResponse(400, false, "Invalid first_name");
}
if($last_name=="" || strlen($last_name)>100){
    sendResponse(400, false, "Invalid last_name");
}
if($email=="" || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email)>254){
    sendResponse(400, false, "Invalid email");
}
if($phone=="" || strlen($phone)>20 || !preg_match('/^[0-9]+$/', $phone)){
    sendResponse(400, false, "Invalid phone number");
}


//connect to database
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if($conn->connect_error){
    sendResponse(500, false, "Connection failed");
}

//prepares the statement to insert into contacts table
$stmt =  $conn->prepare("INSERT INTO Contacts (user_id, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $user_id, $first_name, $last_name, $email, $phone);
$stmt->execute(); 
if($stmt->execute())
    sendResponse(500, true, "Contact created");
else
    sendResponse(500, false, "Contact failed to create");

//closes open statement and connection
$stmt->close();
$conn->close();
