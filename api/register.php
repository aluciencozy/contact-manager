<?php
// handle POST /register

//replace with proper table name later
$tableName='temp';

$username=$_POST['username'];
$email=$_POST['email'];
$phone=$_POST['phone'];
$password=$_POST['password'];


//validates that the input data is not Null and meets requirements
if($username==Null){
    exit('Invalid username');
}

//uses built in Email check
if($email==Null || !filter_var($email, FILTER_VALIDATE_EMAIL)){
    exit('Invalid email');
}

//ensures phone number is 10 char long and only 0-9
if($phone==Null || strlen($phone)!=10 || !preg_match('/^[0-9]+$/', $phone)){
    exit('Invalid phone number');
}

if($password==Null){
    exit('Invalid password');
}


//connects to database
$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if($mysqli->connect_error){
    exit('connection failed');
}


//checks all values within a column for a specifc value
$sqlUsername = "SELECT username FROM $tableName WHERE username='$username'";
$sqlEmail = "SELECT email FROM $tableName WHERE email='$email'";
$sqlPassword = "SELECT phone FROM $tableName WHERE phone='$phone'";


//result returns the number of number of rows with the value found by the prior check
$result=$mysqli->query($sqlUsername);
if($result->num_rows > 0){
    exit('An account with this username already exists');
}

$result=$mysqli->query($sqlEmail);
if($result->num_rows > 0){
    exit('An account with this email already exists');
}

$result=$mysqli->query($sqlPassword);
if($result->num_rows > 0){
    exit('An account with this phone number already exists');
}


//encrypts the password for safe storage use validate to retrieve it later
$hashPassword=password_hash($password, PASSWORD_DEFAULT);

//inserts the values into the database
$sql = "INSERT INTO $tableName (username, email, phone, password)
VALUES ('$username', '$email', '$phone', '$hashPassword')";
$mysqli->query($sql);

//closes connection
$mysqli->close();
