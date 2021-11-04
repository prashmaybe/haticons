<?php
    header("HTTP/1.0 404 Not Found");
    header('Content-Type: application/json');
?>
{
    "status":0,
    "message":"The resource you are looking for is not found!"
}