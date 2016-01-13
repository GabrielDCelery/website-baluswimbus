<?php

require("../settings.php");

$array_of_ids = $_POST["data"];
$array_of_posts = array();

$pdo = new PDO('mysql:dbname=' . $dbname . ';host=' . $host, $admin_username, $admin_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$query_string =
	" SELECT " .
	$post_title . ", " .
	$post_date . ", " .
	$post_content . 
	" FROM " . $tablename_posts . 
	" WHERE " . $post_id . " = " . $array_of_ids[0];

if(count($array_of_ids) > 0){
	for($i = 1; $i < count($array_of_ids); $i++){
		$query_string .= " OR " . $post_id . " = " . $array_of_ids[$i];
	}
}

$query_string .= " ORDER BY " . $post_date  . " DESC ";

$query = $pdo->query($query_string);
$result = $query->fetchAll(PDO::FETCH_ASSOC);

echo(json_encode($result));

?>