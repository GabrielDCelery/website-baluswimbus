<?php

require("../settings.php");

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();
$pdo = $connection->connect();

$query_string = "SELECT id FROM posts WHERE post_status = 'public' ORDER BY post_date DESC";
$query = $pdo->query($query_string);
$result = $query->fetchAll(PDO::FETCH_ASSOC);

echo(json_encode($result));

?>