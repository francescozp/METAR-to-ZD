<?php
header('Access-Control-Allow-Origin:*');
require_once('br-connect.php');


for ($i=0; $i<$response["count"]; $i++){
	$obj[]=(object)[
	'Date' => date(DATE_ISO8601, strtotime($response["results"][$i]["Date"])),
	'QNH'=> floatval($response["results"][$i]["QNH"]),
	'HUM'=> floatval($response["results"][$i]["HUM"]),
	'TEMP'=> floatval($response["results"][$i]["TEMP"]),
	'DP'=> floatval($response["results"][$i]["DP"]),
	'ZD'=> floatval($response["results"][$i]["ZD"]),
	'ZP'=> floatval($response["results"][$i]["ZP"]),
	'VW'=> floatval($response["results"][$i]["VW"]),
	'Wdir'=> ($response["results"][$i]["Wdir"]),
];
}

$data=json_encode($obj);

echo json_encode($obj);
