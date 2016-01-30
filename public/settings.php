<?php

/***************************************************************
DATABASE TABLES DATA FORMAT
***************************************************************/

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