<?php
// handle POST /register

session_start();

//placeholder tablename need to check with database
$tableName='Users';

//inform frontend of result type
//header('Content-Type: application/json; charset=utf-8');

//get variables from database
require __DIR__ . "/config/database.php";


//decodes input allowing to get variables
$user_data = json_decode(file_get_contents("php://input"), true);

$username=$user_data["username"] ?? "";
$email=$user_data["email"] ?? "";
$phone=$user_data["phone"] ?? "";
$password=$user_data["password"] ?? "";

//validates that the input data is not Null and meets requirements
if($username==""){
    exit('Invalid username');
}

//uses built in Email check
if($email=="" || !filter_var($email, FILTER_VALIDATE_EMAIL)){
    exit('Invalid email');
}

//ensures phone number is 10 char long and only 0-9
if($phone=="" || strlen($phone)!=10 || !preg_match('/^[0-9]+$/', $phone)){
    exit('Invalid phone number');
}

if($password==""){
    exit('Invalid password');
}


//connects to database
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if($conn->connect_error){
    exit('connection failed');
}


//checks the values within the database for if username exists already
$stmt = $conn->prepare("SELECT username FROM $tableName WHERE username=?"); //prepared statement to protect against SQL injection
$stmt->bind_param("s", $username); 
$stmt->execute(); 

//result returns the number of number of rows with the value found by the prior check
$result=$stmt->get_result();
if($result->num_rows > 0){
    exit('An account with this username already exists');
}
$stmt->close();

//this code currently prevents an account from being made if one with the corresponding email or phone already exists
$stmt = $conn->prepare("SELECT email FROM $tableName WHERE email=?");
$stmt->bind_param("s", $email); 
$stmt->execute(); 
$result=$stmt->get_result();
if($result->num_rows > 0){
    exit('An account with this email already exists');
}
$stmt->close();

$stmt = $conn->prepare("SELECT phone FROM $tableName WHERE phone=?");
$stmt->bind_param("s", $phone); 
$stmt->execute(); 
$result=$stmt->get_result();
if($result->num_rows > 0){
    exit('An account with this phone number already exists');
}
$stmt->close();

//encrypts the password for safe storage use validate to compare later
$hashPassword=password_hash($password, PASSWORD_DEFAULT);

//generates a unique id. possibly implement after checking how database is handling ids to prevent conflict.
/*
use uniqueid in a while loop. loops while id exists in table
id=uniqueid()
while unique in table{
    id=uniqueid()
}
prevents multiple same ids
*/

//inserts the values into the database
$stmt =  $conn->prepare("INSERT INTO $tableName (username, email, phone, password_hash)
VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", '$username', '$email', '$phone', '$hashPassword'); 
$stmt->execute(); 
$stmt->close();

//closes connection
$conn->close();
