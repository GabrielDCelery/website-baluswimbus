<?php

require("../../settings.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$data_object = $request->data;

$post_title = $data_object->post_title;
$post_date = $data_object->post_date;
$post_content = $data_object->post_content;
$post_status = $data_object->post_status;

$pdo = new PDO('mysql:dbname=' . $dbname . ';host=' . $host, $admin_username, $admin_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$query_string =
	'INSERT INTO ' . $tablename_posts . 
	' (' .
	'post_title, ' .
	'post_date, ' .
	'post_content, ' .
	'post_status' .
	')' .
	' VALUES ' .
	' (' .
	'"' . $post_title . '", ' .
	'"' . $post_date . '", ' .
	'"' . $post_content . '", ' .
	'"' . $post_status . '"' . 
	')';

$query = $pdo->query($query_string);

echo("Bejegyzés sikeresen hozzáadva...");


?>