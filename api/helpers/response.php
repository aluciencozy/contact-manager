<?php
// file to put any helper functions for the server side api routes

// function to help send responses to the frontend
function sendResponse($status_code, $success, $message)
{
  // the http status code (e.g., 200, 401)
  http_response_code($status_code);

  // the json body
  echo json_encode([
      "success" => $success,
      "message" => $message
  ]);

  exit;
}
