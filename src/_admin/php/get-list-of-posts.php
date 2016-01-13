<?php

require("../../settings.php");

$pdo = new PDO('mysql:dbname=' . $dbname . ';host=' . $host, $admin_username, $admin_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$query_string =
	" SELECT " . $post_id . 
	" FROM " . $tablename_posts . 
	" ORDER BY " . $post_date  . " DESC ";

$query = $pdo->query($query_string);
$result = $query->fetchAll(PDO::FETCH_ASSOC);

echo(json_encode($result));

?>