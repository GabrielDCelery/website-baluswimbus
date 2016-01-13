<?php

require("../../settings.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if(isset($request->username) && isset($request->password)){

	$username = $request->username;
	$password = $request->password;

	$pdo = new PDO('mysql:dbname=' . $dbname . ';host=' . $host, $admin_username, $admin_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

	$query_string = 
		"SELECT " . $user_password .
		" FROM " . $tablename_users .
		" WHERE " . $user_username . " = '" . $username . "'";

	$query = $pdo->query($query_string);
	$result = $query->fetchAll(PDO::FETCH_ASSOC);

	if(isset($result[0][$user_password]) && ($result[0][$user_password] == $password)){
		echo('true');
	} else {
		echo('false');
	}

} else {
	echo('false');
}


?>