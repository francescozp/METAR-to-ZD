<?php
header('Access-Control-Allow-Origin:*');
//require_once('../init.php');

$TKN='Authorization: Token '.$APIKEY;
$CURLHDR = array ( $TKN ) ;

$curl =curl_init();

curl_setopt_array($curl, array(
	CURLOPT_URL => 'https://api.baserow.io/api/database/rows/table/'.$TABLENUM.'/?user_field_names=true&size=150',
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => '',
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 0,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => 'GET',
	CURLOPT_HTTPHEADER => $CURLHDR
));

$response = json_decode(curl_exec($curl), true);

curl_close($curl);
?>
