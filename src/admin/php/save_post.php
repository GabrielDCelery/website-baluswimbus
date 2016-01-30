<?php

/************************************************************
DEPENDENCIES
************************************************************/

require '../../settings.php';

/************************************************************
AJAX REQUEST
************************************************************/

$postdata = file_get_contents("php://input");
$dataobject = json_decode($postdata);
$post_status = $dataobject->status;
$post_title = $dataobject->title;
$post_date = $dataobject->date;
$post_content = $dataobject->input;

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();
$pdo = $connection->connect();

$querystring = "INSERT INTO posts (post_status, post_title, post_date, post_content) VALUES (:post_status, :post_title, :post_date, :post_content)";

$preparedstatement = $pdo->prepare($querystring);

$preparedstatement->execute(["post_status" => $post_status, "post_title" => $post_title, "post_date" => $post_date, "post_content" => $post_content]);

echo true;

?>