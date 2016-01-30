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

$post_id = $dataobject->id;
$post_status = $dataobject->status;
$post_title = $dataobject->title;
$post_date = $dataobject->date;
$post_content = $dataobject->input;

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();
$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

$querystring = "UPDATE posts SET post_status = :post_status, post_title = :post_title, post_date = :post_date, post_content = :post_content WHERE id = :post_id";

$preparedstatement = $pdo->prepare($querystring);

$preparedstatement->execute(["post_status" => $post_status, "post_title" => $post_title, "post_date" => $post_date, "post_content" => $post_content, "post_id" => $post_id]);

echo true;

?>