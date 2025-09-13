<?php 
/*
session_start();
if (!isset($_SESSION["authed"]) || $_SESSION["authed"] === false) {
    header("location:auth.php");
    exit(307);
} 
*/
?>   
<!DOCTYPE html>
<html>
<head>
	<meta charset='utf8'>
  	<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
  	<link rel="stylesheet" href="resources/style.css">
	<title>ZD - ACB</title>
</head>

<header>
	<div style="text-align:center;">Développé & mis à disposition gracieusement par l'Aéroclub de Méribel</div>
	<h1 class="pageTitle"><span id='Title'></span></h1> 
	<h1 class="pageSubtitle"><span id='Subtitle'></span></h1>
</header>
	<div style="text-align:center;"><i class="label" style="line-height1.1vw;"><span id='Alert'></span></i></div>

<body> 	
	<h2> Z<sub>d</sub> = <span id='ZD'></span> ft </h2>
	<h3>Les données affichées les plus récentes ont été enregistrées <span id='dataRefresh'></span></h3>
	<p style="text-align:center;">
		<span id='Metar'></span><br>
		<span id='TAF'></span>
	</p>
	<div class="conteneur">
		<div class="box">
			<div class="boxb dataB" style="width:50%;">
				<table>
					<tr>
			   		<td><i>QNH</i></td>
					</tr>
					<tr>
			 	 		<td style="color: #28fb07 ;"><strong><span id='QNH'></span></strong> hPa </td>
					</tr>
				</table>
			</div>
		</div>	
		<div class="box dataB">
			<div class="boxa" id="windBox">
				<img style="display:block; position:absolute; z-index:0; " src="img/nord.png" alt="Nord" height="190%">
				<img id="rwydir" style="display:block; position:absolute; z-index:2; " src="img/rwy.png" alt="Piste" height="190%">
				<img id="rotated" style="display:block; position:absolute; z-index:3; " src="img/vent.png" alt="Vent" height="190%">
			</div>
			<div class="float-childbb" >
				<table>
					<tr style="color: #28fb07 ;">
					  <td><span id='Wdir'></span>°/</td><td align="right"><strong><span id='MeanW'></span></strong> kt</sub> </td>
					</tr>
				</table>
			</div>
		</div>
		<div class="box label">
		  <table>
					<tr>
			  			<td><i>Altitude-pression (Z<sub>p</sub>)</i></td>
					</tr>
					<tr>
 			 	  		<td><span id='ZP'></span> ft</td>
					</tr>
			</table>
		</div>
	
		<div class="box dataB">
		<table>
					<tr>
					 <td><i>T<sub>ext</i></sub> </td><td></td>
					 </tr><tr>
				 	 <td><strong><span id='TEMPEX'></span></strong>°C</td>
					</tr>
		
			</table>
		</div>
	
	<div class="box dataB">
		 <table>
					<tr>
			  		<tr>
				  	<td><i>&Delta;<sub>ISA</sub></i></td><td></td>
				  	</tr><tr>
				  	<td style="color: #28fb07 ;"><span id='DISA'></span>°C</td>
					</tr>
					</tr>
			</table>
	</div>
		
		
  	<div class="box label">
	 			 <table>
					<tr>
				  	<td><i>T<sub>dew</sub></i> </td>
				  	<td><span id='DP'></span>°C</td>
					</tr>
					<tr>
				  	<td><i>Humidité</i></td>
				  	<td><span id='HUMEX'></span>%</td>
					</tr>
				</table>
    </div>

    <div class="bbox" style="padding:5px; "><div id="qnhChart"></div></div>
   	
		<div class="bbox" style="padding:5px; "><div id="zdChart"></div></div>
   	
		<div class="bbox" style="padding:5px; "><div id="tempeChart"></div></div>
   	
		<div class="bbox" style="padding:5px;"><div id='myDiv'></div></div>
		
		<div class="bbbox" style="padding:5px;"> <div id='windChart'></div></div>

   	<div class="box" style="padding:10px">
		  <div class="float-childa"><img src="img/lever-du-soleil.png" alt="Sunrise" width="80%" height="80%"> </div> 
		  <div class="float-childb"><div class="data"><i>Début du jour aéro</i></br><strong><span id="sunriseloc"></span></strong></div>
		  	<div class="data"><strong><span id="sunriseutc"></span></strong></div>
			</div>
   	</div>
   
	 	<div class="box" style="padding:10px">
	    <div class="float-childa"><img src="img/clock.png" alt="clock" width="75%" height="75%"> </div> 
	    <div class="float-childb"><div class="data"><strong><span id="heureloc"></span></strong></div>
				<div class="data"><strong><span id="heureutc"></span></strong></div>
				<div class="data"><strong><span id="date"></span></strong></div>
			</div>
    </div>
   	<div class="box" style="padding:10px">		
	    <div class="float-childa"><img src="img/soleil.png" alt="Sunset" width="80%" height="80%"></div>
		  <div class="float-childb"><div class="data"><i>Fin du jour aéro</i></br><strong><span id="sunsetloc"></span></strong></div>
				<div class="data"><strong><span id="sunsetutc"></span></strong></div>
			</div>
		</div>
	</div>
</body>


<footer>
</footer>

	<script src='https://cdnjs.cloudflare.com/ajax/libs/luxon/3.7.2/luxon.min.js'></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartjs-scale-timestack/dist/chartjs-scale-timestack.min.js"></script>
	<script src="https://cdn.plot.ly/plotly-3.1.0.min.js" charset="utf-8"></script>
	
	<script src='https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.js'></script>
	
	<script type="application/javascript" src='../../altidensite/scripts/phptojs.php'></script>
	<script src="resources/scriptData.js"></script> 	

</html>
