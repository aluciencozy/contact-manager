<?php
// handle POST /login
$username=$_POST['username'];
$password=$_POST['password'];

$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if($mysqli->connect_error){
    exit('connection failed');
}

//finds row in datbase with the given username and return both username nad password
$sqlUsername = "SELECT username,password FROM $tableName WHERE username='$username'";
$result=$mysqli->query($sqlUsername);

//checks if the search found nothing
if($result==false){
  exit('Invalid username or Password');
}

//allows for the row to be accessed given the variable names
$row = $result->fetch_assoc(MYSQLI_NUM);

//uses varify to check password against hashed one in database and ensures username matches
if (password_verify($password, $row['$password'])&&$row['username']==$username)
  //still need to update this with the proper thing to return upon successful login
  exit('update with proper logged in state');
else
  exit('Invalid username or Password');
