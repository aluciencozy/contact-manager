<?php 
// update (patch) contacts logic

session_start();

//inform frontend of result type
header('Content-Type: application/json; charset=utf-8');

//get variables from database and response helper
require __DIR__ . "/../config/database.php";
require __DIR__ . "/../helpers/response.php";

//decodes input to use
$contact_data = json_decode(file_get_contents("php://input"), true);

/*not sure exactly how you want the buttons to work so for now 
    i designed them off of the idea of the button passing the id of the user*/
$id=$contact_data["id"] ?? "";
$first_name=trim($contact_data["first_name"] ?? "");
$last_name=trim($contact_data["last_name"] ?? "");
$email=trim($contact_data["email"] ?? "");
$phone=trim($contact_data["phone"] ?? "");
$userId = filter_var(
    $_SESSION["user_id"] ?? null,
    FILTER_VALIDATE_INT,
    ["options" => ["min_range" => 1]]
);

if ($userId === false) {
    sendResponse(401, false, "You must be logged in", ["contacts" => []]);
}

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

//navigates to the row of the given id changing the other variables based off the input
$stmt = $conn->prepare("UPDATE Contacts SET first_name=?, last_name=?, email=?, phone=? WHERE id=? AND user_id = ?");
$stmt->bind_param("ssssii", $first_name, $last_name, $email, $phone, $id, $userId); 

//checks if the code properly ran and runs the statement
if(!$stmt->execute()){
    sendResponse(500, false, "failed to update contact");
}
else sendResponse(200, true, "contact successfullly updated");

$stmt->close();
$conn->close();
