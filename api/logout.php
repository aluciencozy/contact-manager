<?php 
// handle POST /logout

session_start();

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . "/helpers/response.php";

// destroy the current session
session_destroy();

sendResponse(200, true, "Successfully logged out");
