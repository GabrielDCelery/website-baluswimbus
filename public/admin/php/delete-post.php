<?php

require("../../settings.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$id = $request->data;

$pdo = new PDO('mysql:dbname=' . $dbname . ';host=' . $host, $admin_username, $admin_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$query_string = 
	" DELETE FROM " .
	$tablename_posts .
	" WHERE " . $post_id . " = " . $id;

$pdo->query($query_string);


echo("Bejegyzés sikeresen törölve...");

?>