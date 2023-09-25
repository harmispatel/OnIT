<?php

define("SERVER_URL", "http://localhost/code/projects/onit/services/services.php");
// define("SERVER_URL", "http://onit.my/services/services.php");
define("LOG_SENT", true);
define("LOG_RECEIVED", true);
define("SENT_LOG_FILE", "./log/sent_log.txt");
define("REC_LOG_FILE", "./log/rec_log.txt");

if (isset($_SERVER['REQUEST_METHOD']))
{
	$data_send = @file_get_contents('php://input');
	// $data_send = $_POST;


	if (constant("LOG_SENT") == true)
	{
		log_incoming("SENT = " . $data_send, constant("SENT_LOG_FILE"));
	}
	$rest_url 	= SERVER_URL;
	$ch 		= curl_init();

	curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS,  $data_send);
	curl_setopt($ch, CURLOPT_HEADER, false);		// added to see incoming from web service
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);	// added to see incoming from web service
	curl_setopt($ch, CURLOPT_URL, $rest_url);

	header("Content-Type: application/json");
	$data = curl_exec($ch);

	if (curl_errno($ch))
	{
		print curl_error($ch);
	}
	else
	{
		curl_close($ch);
	}

	if (LOG_RECEIVED == true)	// added to log incoming from web service
	{
		log_incoming("RECEIVED = " . $data, constant("REC_LOG_FILE"));
	}
	echo $data;

	// return $data;   was taken out to see whats is coming from server


}

function log_incoming($str_data, $fname)
{
	if ($fname != "")
	{
		date_default_timezone_set('Asia/Kuala_Lumpur');
		$date = date("Y-m-d H:i:s");

		//open file and write msg into it
		$fh = fopen($fname, 'a+') or die("can't open file");
		fwrite($fh, "[" . $date . "]\r\n");
		fwrite($fh, $str_data);
		fwrite($fh, "\r\n\r\n\r\n");
		fclose($fh);
	}
}
