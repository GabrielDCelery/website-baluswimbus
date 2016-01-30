<?php

/************************************************************
DEPENDENCIES
************************************************************/

require("../settings.php");

/************************************************************
AJAX CALL
************************************************************/

$array_of_ids = $_POST["data"];

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();
$pdo = $connection->connect();

$query_string = " SELECT post_title, post_date, post_content FROM posts WHERE id = " . $array_of_ids[0];

if(count($array_of_ids) > 0){
	for($i = 1; $i < count($array_of_ids); $i++){
		$query_string .= " OR id = " . $array_of_ids[$i];
	}
}

/************************************************************
QUERY
************************************************************/

$query_string .= " ORDER BY post_date DESC ";

$query = $pdo->query($query_string);
$result = $query->fetchAll(PDO::FETCH_ASSOC);

echo(json_encode($result));

?>