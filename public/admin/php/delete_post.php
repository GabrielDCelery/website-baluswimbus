<?php

/************************************************************
DEPENDENCIES
************************************************************/

require '../../settings.php';

/************************************************************
AJAX REQUEST
************************************************************/

$postdata = file_get_contents("php://input");
$id = json_decode($postdata);

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();
$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

$querystring = "DELETE FROM posts WHERE id = :id";

$preparedstatement = $pdo->prepare($querystring);
$preparedstatement->execute([':id' => $id]);

echo true;


?>