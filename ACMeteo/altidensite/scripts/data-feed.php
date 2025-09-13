<?php
header('Access-Control-Allow-Origin:*');
require_once('../init.php');


$TKN='Authorization: Token '.$APIKEY;
$CURLHDR = array ( $TKN ) ;

$url='https://aviationweather.gov/api/data/metar?ids=';
$endurl='&format=json&taf=false';
$fullurl=$url.$AD.$endurl;

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => $fullurl,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
));

$response = curl_exec($curl);
var_dump($response);
curl_close($curl);

$data=json_decode($response,true);
$temp=$data[0]['temp'];
$dew=$data[0]['dewp'];
$wdir=$data[0]['wdir'];
$wspd=$data[0]['wspd'];
$qnh=$data[0]['altim'];
$time=$data[0]['reportTime'];

$zp=round($zAD+(1013.25-$qnh)*27);
$zd=round(($zp+($temp-(15-2*$zAD/1000))*120)/100)*100;
$hum=round(100*(exp(17.625*$dew/(243.04+$dew))/exp(17.625*$temp/(243.04+$temp))));


// var_dump($temp,$dew,$wdir,$wspd,$qnh,$hum,$zp,$zd);

$dataBR=array('Date'=>$time, 'QNH'=>$qnh, 'HUM'=>$hum, 'TEMP'=>$temp, 'DP'=> $dew, 'ZD'=>$zd, 'ZP'=>$zp, 'VW'=>$wspd, 'Wdir'=>$wdir);

//var_dump($dataBR);

$curl = curl_init();

curl_setopt_array($curl, array(
	CURLOPT_URL => 'https://api.baserow.io/api/database/rows/table/'.$TABLENUM.'/?user_field_names=true&size=150',
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => '',
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 0,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => 'POST',
	CURLOPT_POSTFIELDS => $dataBR,
	CURLOPT_HTTPHEADER => $CURLHDR 
));

$response = curl_exec($curl);

curl_close($curl);
//echo $response;
 


$curl = curl_init();

curl_setopt_array($curl, array(
	CURLOPT_URL => 'https://api.baserow.io/api/database/rows/table/'.$TABLENUM.'/?user_field_names=true&size=150',
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => '',
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 0,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => 'GET',
	CURLOPT_POSTFIELDS => $dataBR,
	CURLOPT_HTTPHEADER => $CURLHDR 
));

$resp = curl_exec($curl);
$response= json_decode($resp, true);
curl_close($curl);
$nbitems=$response["count"];


if ($nbitems >= 144){
	$deleteline=$response['results'][0]['id'];
	$urldelete='https://api.baserow.io/api/database/rows/table/'.$TABLENUM.'/'.$deleteline.'/';

	$curl = curl_init();

	curl_setopt_array($curl, array(
		CURLOPT_URL => $urldelete,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => '',
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 0,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => 'DELETE',
		CURLOPT_HTTPHEADER => $CURLHDR 
	));

	$response = curl_exec($curl);

	curl_close($curl);
	//echo $response;
	}


 ?>
