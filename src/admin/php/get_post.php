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

$querystring = "SELECT * FROM posts WHERE id = :id";
$preparedstatement = $pdo->prepare($querystring);
$preparedstatement->execute([':id' => $id]);
$results = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);

echo(json_encode($results));


?>