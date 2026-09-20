<?php
// handle POST /register

session_start();

//inform frontend of result type
header('Content-Type: application/json; charset=utf-8');

//get variables from database and respone helper
require __DIR__ . "/config/database.php";
require __DIR__ . "/helpers/response.php";



//decodes input allowing to get variables
$user_data = json_decode(file_get_contents("php://input"), true);

$username=$user_data["username"] ?? "";
$email=$user_data["email"] ?? "";
$phone=$user_data["phone"] ?? "";
$password=$user_data["password"] ?? "";

//validates that the input data is not Null and meets requirements
if($username=="" || strlen($username)>50){
    sendResponse(400, false, "Invalid username");
}

//uses built in Email check
if($email=="" || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email)>254){
    sendResponse(400, false, "Invalid email");
}

//ensures phone number is 10 char long and only 0-9
if($phone=="" || strlen($phone)!=10 || !preg_match('/^[0-9]+$/', $phone)){
    sendResponse(400, false, "Invalid phone number");
}

if($password==""){
    sendResponse(400, false, "Invalid password");
}


//connects to database
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if($conn->connect_error){
    sendResponse(500, false, "Connection failed");
}


//checks the values within the database for if username exists already
$stmt = $conn->prepare("SELECT username FROM Users WHERE username=?"); //prepared statement to protect against SQL injection
$stmt->bind_param("s", $username); 
$stmt->execute(); 

//result returns the number of number of rows with the value found by the prior check
$result=$stmt->get_result();
if($result->num_rows > 0){
    sendResponse(400, false, "An account with this username already exists");
}
$stmt->close();

//this code currently prevents an account from being made if one with the corresponding email or phone already exists
$stmt = $conn->prepare("SELECT email FROM Users WHERE email=?");
$stmt->bind_param("s", $email); 
$stmt->execute(); 
$result=$stmt->get_result();
if($result->num_rows > 0){
    sendResponse(400, false, "An account with this email already exists");
}
$stmt->close();

$stmt = $conn->prepare("SELECT phone FROM Users WHERE phone=?");
$stmt->bind_param("s", $phone); 
$stmt->execute(); 
$result=$stmt->get_result();
if($result->num_rows > 0){
    sendResponse(400, false, "An account with this phone number already exists");
}
$stmt->close();

//encrypts the password for safe storage use validate to compare later
$hashPassword=password_hash($password, PASSWORD_DEFAULT);

//inserts the values into the database
$stmt =  $conn->prepare("INSERT INTO Users (username, email, phone, password_hash)
VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $username, $email, $phone, $hashPassword); 
$stmt->execute(); 
$stmt->close();

//set's User_id to the newly created account and returns a success
$_SESSION["user_id"]=$conn->insert_id;
sendResponse(201, true, "Account created successfully");

//closes connection
$conn->close();
