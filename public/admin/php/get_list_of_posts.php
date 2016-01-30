<?php

/************************************************************
DEPENDENCIES
************************************************************/

require '../../settings.php';

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();
$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

$querystring = "SELECT id, post_status AS status, post_date AS date, post_title AS title FROM posts ORDER BY date DESC";

$preparedstatement = $pdo->prepare($querystring);
$preparedstatement->execute();
$results = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);

echo(json_encode($results));


?>