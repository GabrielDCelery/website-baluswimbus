<?php

/***************************************************************
DATABASE TABLES DATA FORMAT
***************************************************************/

$tablename_posts = "posts";
$post_id = "id";
$post_status = "post_status";
$post_date = "post_date";
$post_title = "post_title";
$post_content = "post_content";

$tablename_users = "users";
$user_id = "id";
$user_username = "username";
$user_password = "password";


class dbConnect {
	private $host = 'localhost';
	private $db_name = "baluswimbusz";
	private $admin_username = "root";
	private $admin_password = null;

	public function connect(){
		$pdo = new PDO('mysql:dbname=' . $this->db_name . ';host=' . $this->host, $this->admin_username, $this->admin_password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		return $pdo;
	}
}


/***************************************************************
TIMEZONE
***************************************************************/

date_default_timezone_set("Europe/Paris");

?>