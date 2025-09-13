
// VARIABLES GLOBALES
var ts=[];
var pointsQnh = [];
var pointsTempex = [];
var pointsDp = [];
var pointsZd = [];
var minWs = [];
var maxWs = [];
var meanWs = [];
var wDirS = [];
var timeS =[];
var annotations = [];
var rpolara=[];
var thetapolara=[];
var rpolarb=[];
var thetapolarb=[];

const BRFreqMes= 30;

var config ={displayModeBar: false};                    // pour plotly.js


// Adresses de récupération des HLOC et HUTC, pour éviter les problèmes de passage H d'hiver et H d'été (LOC)
const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}` 		 // Adresse de récupération des hLOC sunrise-sunset
const urlUTC = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&timezone=UTC` // Adresse de récupération des hUTC sunrise-sunset


// Elements des 3 premières lignes de la page
document.querySelector('#Title').innerHTML = Titre;
document.querySelector('#Subtitle').innerHTML = SousTitre;
document.querySelector('#Alert').innerHTML = Alerte;

const rwydir = document.getElementById("rwydir"); 
      rwydir.style.transform = "rotate("+qfu+"deg)"; 	// Tourne la piste suivant son QFU


// FONCTIONS UTILISEES POUR REMPLIR LES CHAMPS DE LA PAGE
function getNumber(theNumber)			    	// AFFICHAGE DU SIGNE +- DEVANT TEMPE
{
    if(theNumber > 0){
        return "+" + theNumber;
    }else{
        return theNumber.toString();
    }
}

// FONCTION POUR AJOUTER UN ZERO A L'HEURE
function z(n) {
  return ('0' + n).slice(-2);
}




function initialize(){
	timeS=null;			timeS=[];
	meanWs=null;		meanWs=[];
	annotations=null;	annotations=[];
	ts=null;
	pointsQnh=null; 	pointsQnh = [];
	pointsTempex=null;	pointsTempex = [];
	pointsDp=null;		pointsDp=[];
	pointsZd=null;		pointsZd=[];
	rpolara=null;		rpolara=[];
	thetapolara=null;	thetapolara=[];
	rpolarb=null;		rpolarb=[];
	thetapolarb=null;	thetapolarb=[];
}


// REMPLISSAGE DES CHAMPS DE DONNEES DE LA PAGE (GRAPHS, VALEURS....)
myData();
sunRsunS();
myTimer();
const myInterval = setInterval(myTimer, 60000);  // MISE A JOUR DES DONNEES TOUTES LES MINUTES



// Collecte de la réponse de l'API Baserow
function myData(){
fetch('resources/metartaf.php')
  .then((response) => response.text())
  .then((result) => {
    let metarTAF=result.split("TAF"); 
    document.querySelector('#Metar').innerHTML = "METAR "+metarTAF[0];
    document.querySelector('#TAF').innerHTML = "TAF"+metarTAF[1];})
  .catch((error) => console.error(error));

fetch('resources/request.php')
  .then((response) => response.json())
  .then(datafg => { 
	    let resData=datafg; 
	    let nIdx=(datafg.length)-1; 
		  if (nIdx > (60/BRFreqMes)*24)
		  	nIdxDay=nIdx-((60/BRFreqMes)*24);
		  else nIdxDay=0;
		  if (nIdx > ((120/BRFreqMes)-1))
	 	    nIdxTwoH=nIdx-(120/BRFreqMes); 
		  else nIdxTwoH=0;
	    let ii=nIdxDay;
	   
	   
	    for (let i=0; i<nIdx+1; i++){ 
				let datei=resData[i].Date.split("T");           // Date pour les graphs QNH, TEMPE, ZD
				var bb = datei[1].split('.');
				ts.push(datei[0]+" "+bb[0]); 
				pointsQnh.push(resData[i].QNH);            	// Données QNH pour graphique 
				pointsZd.push(resData[i].ZD);                // Données ZD pour graphique
				pointsTempex.push(resData[i].TEMP);           // Données température extérieure pour graphique
				pointsDp.push(resData[i].DP);                // Données point de rosée pour graphique 
				
				if ((i>nIdxDay-1)){// && i==ii){		            //Données pour le suivi du vent sur 24h
    					meanWs.push(resData[i].VW);
					//wDirS.push(parseInt(resData[i].Wdir));
					let dateh=resData[i].Date.split("T");  
					var b = dateh[1].split('.');
					timeS.push(dateh[0]+" "+b[0]); //ts);
					
					if(resData[i].Wdir >= 0){
					  annotations.push({
						  x: dateh[0]+" "+b[0],
						  y: 0,
						  text:  '\u2799', //'\u27a4',
						  textangle: (parseInt(resData[i].Wdir)+90),
						  showarrow: false, 
						  font: {
							  color: 'rgba(45, 117, 253, 0.8)', 
							  size: 30,
							},
					  })
          }
					else {
						annotations.push({
						  x: dateh[0]+" "+b[0],
						  y: resData[i].VW,
						  text: "" ,
						  textangle:"" ,
						  showarrow: false, 
						  font: {
							  color: 'rgba(255, 255, 0, 0.8)',
							  size: 36,
							},
					  })
          }
					//ii=i+3;
				}

				if (i>nIdxTwoH){ 					                      // Données pour la rose des vents sur les 2 denrnières H avec <1h et > 1h
					if ((i-nIdxTwoH)<(60/BRFreqMes)+1){	        		  // >1h
				  	rpolara.push(resData[i].VW);
				  	thetapolara.push(parseInt(resData[i].Wdir));
					}
					else {							                          // <1h
					  rpolarb.push(resData[i].VW);
					  thetapolarb.push(parseInt(resData[i].Wdir));
					}
				}
			}

      // GRAPHIQUES
      lineplotQ(pointsQnh,ts);                                // Evolution du QNH
      lineplotZ(pointsZd,ts);                                 // Evolution ZD
      lineplotT(pointsTempex, pointsDp,ts);                   // Evolution température et point de rosée
      arealineplot(meanWs,timeS);             			      // Evolution du vent sur 24h
      polarplot(rpolarb,thetapolarb,rpolara,thetapolara);     // Evolution du vent sur 2h

      // Initialisation des variables intermédiaires
	    let ZD= Math.trunc(resData[nIdx].ZD).toLocaleString(); 
	    let QNH=Math.round(resData[nIdx].QNH,0);
	    let ZP=Math.trunc(Zterrain+(1013.25-QNH)*28).toLocaleString(); 
	    let QFE=Math.round(resData[nIdx].QFE,0).toLocaleString();
	    let HUMEXT=Math.round(resData[nIdx].HUM*10)/10;			//HUMEX POUR PHP
	    let DP=Math.round(resData[nIdx].DP*10)/10;
	    let TEMPEX=Math.round(resData[nIdx].TEMP*100)/100;
	    let DISA=Math.round(TEMPEX-(15-2*(Zterrain/1000))); // Calcul de l'écart de température par rapport à ISA
	  
      
  	  let wdir=parseInt(resData[nIdx].Wdir);        // Ajout de 00 à la direction du vent pour degrés et dizaines
      if (wdir >=0){                
	    	if (wdir <100){
			    if (wdir <10)
				    Wdir="00"+wdir;
			    else
				    Wdir="0"+wdir;
          }
		    else Wdir=wdir;
      }
      else Wdir='VRB';

	    let MeanW=Math.round(resData[nIdx].VW,0); 
	    
     // let icing_sentence=icing(DP,HUMEXT); // Givrage

      // Manipulation des données de date pour la fraîcheur des données
	    let dateh=resData[nIdx].Date.split("T");  	
	    var a = dateh[0].split('-');
	    var b = dateh[1].split(':');
	    dateh[1]=b[0]+":"+b[1]+" UTC";
	    var date = new Date (a[0], a[1] - 1,a[2]).toLocaleDateString();    //using a[1]-1 since Date object has month from 0-11
	    var now = new Date();
	    var Today=now.toLocaleDateString();
		  if (date == Today)
			  dateData="aujourd'hui à "+dateh[1];
		  else
			  dateData='le '+date+' à '+dateh[1];
	  	  
      // Insertion des données dans le document HTML/PHP
      document.querySelector('#ZD').innerHTML = ZD;
      document.querySelector('#ZP').innerHTML = ZP;
      document.querySelector('#QNH').innerHTML = QNH.toLocaleString();
      document.querySelector('#HUMEX').innerHTML = HUMEXT; 
      document.querySelector('#DP').innerHTML = getNumber(DP);
      document.querySelector('#TEMPEX').innerHTML = getNumber(TEMPEX);
      document.querySelector('#DISA').innerHTML = getNumber(DISA);
      document.querySelector('#dataRefresh').innerHTML = dateData;
      
     // document.querySelector('#icing').innerHTML = icing_sentence ;
     // document.querySelector('#icingbox').style=icing_box_style;

      document.querySelector('#Wdir').innerHTML = Wdir;  
      document.querySelector('#MeanW').innerHTML = MeanW;
      if(resData[nIdx].Wdir >=0){
      const rotated = document.getElementById("rotated"); 
      rotated.style.transform = "rotate("+wdir+"deg)"; 	// Tourne la flèche du vent
      }
      else {
        document.getElementById("windBox").innerHTML = " "; //Vent variable";
      }
  })
 .catch((error) => console.error(error));
}


//mise à jour toutes les secondes
function myTimer() {
  const now = new Date();
 
  // Mise à jour des heures de début et de fin du jour aéro, tous les jours à minuit, et la date du jour
  if(now.getHours()==0 && now.getMinutes()==1 && now.getSeconds()<5){
    sunRsunS();  
  }
   
  // Mise à jour des données affichées toutes les X minutes
	const updmin = (now.getMinutes()-1)/BRFreqMes;
	if (Number.isInteger(updmin) && now.getSeconds()==0){
		initialize();
		myData();
	}

  // Mise à jour de l'heure LOC et UTC toutes les secondes
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const UTCtime = z(now.getUTCHours()) + ':' + z(now.getUTCMinutes()); //now.toUTCString([], { hour: "2-digit", minute: "2-digit" });	
  document.getElementById("heureloc").innerHTML = time + ' LOC';
  document.getElementById("heureutc").innerHTML = UTCtime + ' UTC';; //.split(" ")[4] + ' UTC';
}


// FONCTION GIVRAGE CARBU
//function icing(dtemp,hum){
	//light=(-6.4072e-9*(dtemp**8))+(3.0159e-7*(dtemp**7))+(4.1103e-7*(dtemp**6))-(1.6657e-4*(dtemp**5))+(1.4694e-3*(dtemp**4))+(1.1214e-2*(dtemp**3))+(-8.2182e-3*(dtemp**2))-(1.7104*dtemp)+25.127;
	//moderate=(9.3322e-8*(dtemp**8))-(9.2519e-6*(dtemp**7))+(3.6036e-4*(dtemp**6))-(6.9324e-3*(dtemp**5))+(6.8216e-2*(dtemp**4))-(3.2754e-1*(dtemp**3))+(8.6709e-1*(dtemp**2))-(2.7746*dtemp)+35.253;
	//severe=(0.0000025595*(dtemp**8))-(0.00011911*(dtemp**7))+(0.0019297*(dtemp**6))-(0.011065*(dtemp**5))-(0.010374*(dtemp**4))+(0.21241*(dtemp**3))+(0.45133*(dtemp**2))-(3.6456*dtemp)+58.154;  // OK!
	//if (hum<light){
		//icing_sent="Pas de givrage";
		//icing_box_style=" ";
	//}
	//else if (hum<moderate){
		//icing_sent="Givrage faible tous régimes";
		//icing_box_style="background:yellow; color:black;";
	//}
	//else if (hum>moderate && hum<severe){
		//icing_sent="Givrage sévère moteur réduit";
		//icing_box_style="background:orange; color:black;";
	//}
	//else if(hum>severe){
		//icing_sent="Givrage sévère tous régimes";
    //icing_box_style="background:#CA2017; color:yellow;";
	//}
  ////console.log(light,moderate,severe);
  //return icing_sent;

//}


    

// FONCTIONS DES GRAPHIQUES
function lineplotQ(m1,timeref){					// Graph QNH
	var trace1 = {
    x: timeref,
    y: m1,   
    mode: 'lines',
    type: 'scatter',
    line: {
      color: 'grey', //'rgb(85, 225, 0, 0.9)',//'rgb(55, 128, 191)',
      width: 4
    } 
  };

  var data = [trace1];

  var layout = {
    title: {text: 'Évolution du QNH (hPa)',
    font: {
		  family: ' Tahoma',
		  size: 14,
		  color:'grey',
	  }},
    showlegend: false, 
    autosize: true, //false,
	  margin: {
      l: 40,
      r: 20,
      b: 30,
      t: 45,
      pad: 0,
    },
    paper_bgcolor: '#00000000',
    plot_bgcolor: '#00000000',
    xaxis: {
      tickfont: {
        family: ' Tahoma',
        color: 'rgb(160,160,160)'
      },
    gridcolor: 'rgb(217,215,215)'
    },
    yaxis: {
      tickfont: {
        family: ' Tahoma',
        color: 'grey'
      },
      title: {
        font: {
          family: ' Tahoma',
          size: 12,
          color: 'grey', //'rgb(160,160,160)'
        }
      },
      gridcolor: 'rgb(217,215,215)'
    }
  };

  Plotly.react(qnhChart, data, layout, config); 	// newPlot
}



function lineplotZ(m1,timeref){					// Graph ZD
	var trace1 = {
    x: timeref,
    y: m1,
    mode: 'lines',
    type: 'scatter',
    line: {
      color: 'green', //rgb(85, 225, 0, 0.9)',//'rgb(55, 128, 191)'
      width: 4
    } 
  };

  var data = [trace1];

  var layout = {
    title: {text: 'Évolution de l\'altitude-densité (ft)',
		font: {
	  	family: ' Tahoma',
		  size: 14,
		  color:'grey',
		}},
    showlegend: false, 
    autosize: true,
  	margin: {
      l: 40,
      r: 20,
      b: 30,
      t: 45,
      pad: 0,
    },
    paper_bgcolor: '#00000000',
    plot_bgcolor: '#00000000',
    xaxis: {
      tickfont: {
        family: ' Tahoma',
        color: 'rgb(160,160,160)'
      },
    gridcolor: 'rgb(217,215,215)'
    },
    yaxis: {
      tickfont: {
        family: ' Tahoma',
        color: 'grey'
      },
      title: {
        font: {
          family: ' Tahoma',
          size: 12,
          color: 'grey', //'rgb(160,160,160)'
        }
      },
      gridcolor: 'rgb(217,215,215)'
    }
  };

  Plotly.react(zdChart, data, layout, config); 	// newPlot
}


function lineplotT(m1,m2,timeref){					// Graph température
	var trace1 = {
    x: timeref,
    y: m1,   //MaxW
    mode: 'lines',
    type: 'scatter',
    line: {
      color: 'orange', //rgb(85, 225, 0, 0.9)',//'rgb(55, 128, 191)',
      width: 4
    } 
  };

  var tracedp = {
    x: timeref,
    y: m2,   //MaxW
    mode: 'lines',
    type: 'scatter',
    line: {
      color: 'blue', //rgb(85, 225, 0, 0.9)',//'rgb(55, 128, 191)',
      width: 4
    } 
  };

  var data = [trace1, tracedp];

  var layout = {
    title: {text: 'Évolution de la température et du point de rosée (°C)',
		font: {
	  	family: ' Tahoma',
		  size: 14,
	  	color:'grey',
		}},
    showlegend: false, 
    autosize: true,
	  margin: {
      l: 40,
      r: 20,
      b: 30,
      t: 45,
      pad: 0,
    },
    paper_bgcolor: '#00000000',
    plot_bgcolor: '#00000000',
    xaxis: {
      tickfont: {
        family: ' Tahoma',
        color: 'rgb(160,160,160)'
      },
      gridcolor: 'rgb(217,215,215)'
    },
    yaxis: {
      tickfont: {
        family: ' Tahoma',
        color: 'grey'
      },
      title: {
        font: {
          family: ' Tahoma',
          size: 12,
          color: 'grey', //'rgb(160,160,160)'
        }
      },
      gridcolor: 'rgb(217,215,215)'
    }
  };

  Plotly.react(tempeChart, data, layout, config); 	// newPlot

}




function arealineplot(m2,timeref){	// Graph vent sur 24h
	
  var trace3 = {
    x: timeref,
    y: m2,	//meanW
    mode: 'lines',//+markers',
    type: 'scatter',  //MeanW
    line: {
      color: 'rgb(85, 225, 0, 0.9)',//'rgb(55, 128, 191)',
      width: 3
    }
  };

  var data = [trace3];

  var layout = {
    title: {text: 'Évolution du vent sur 24h (vitesse en kt et direction en fonction du temps)',
		font: {
		  family: 'Tahoma',
		  size: 14,
		  color:'grey',
		}},
    showlegend: false, 
    annotations: annotations,
    autosize: true, 
  	margin: {
      l: 20,
      r: 20,
      b: 30,
      t: 45,
      pad: 0,
    },
    paper_bgcolor: '#00000000',
    plot_bgcolor: '#00000000',
    xaxis: {
      tickfont: {
        family: ' Tahoma',
        color: 'rgb(160,160,160)'
      },
      gridcolor: 'grey' //'rgb(160,160,160)'
    },
    yaxis: {
      tickfont: {
        family: 'Tahoma',
        color: 'grey'
      },
      title: {
        font: {
          family: 'Tahoma',
          size: 12,
          color: 'grey', //'rgb(160,160,160)'
        }
      },
      gridcolor: 'grey', //'rgb(160,160,160)'
    }
  };

  Plotly.react(windChart, data, layout, config); 	// newPlot

  window.onresize = function() {
    Plotly.Plots.resize(tempeChart);
    Plotly.Plots.resize(zdChart);
    Plotly.Plots.resize(qnhChart);
    Plotly.Plots.resize(windChart);
    Plotly.Plots.resize(myDiv);
  };
}


function polarplot(r1,th1,r2,th2){					// Graph vent sur 2h
	var datapolar = [
    {
      type: "scatterpolargl",
      r: r1, //[2,3,5,7],
      theta: th1, //[12,13,14,15],
      mode: "markers",
      name: "Vent < 1h",
      marker: {
        color: "blue", //"yellow", //rgba(204,102,0,1)",
	      font:' Tahoma',
        size: 15,
        line: {
          color: "grey"
        },
        opacity: 1
      },
      cliponaxis: false
    },
	{									// JEU DE DONNEES VENT > 1h
      type: "scatterpolargl",
      r: r2, //[12,23,25,17],
      theta: th2, //[120,150,214,315],
      mode: "markers",
      name: "Vent > 1h",
      marker: {
        color: "green", //rgba(204,102,0,1)",
	      font:' Tahoma',
        size: 15,
        line: {
          color: "grey"
        },
        opacity: 0.6
      },
      cliponaxis: false
    },
  ]
  
  var layoutpolar = {
    title: {
      text: "Vent maximal depuis 2h, en bleu depuis 1h",
      //y:0.8,
      font: {
        size: 12,
        color:'grey',
		  },
    },
    showlegend: false,
    autosize: true,
  	margin: {
      l: 20,
      r: 20,
      b: 30,
      t: 45,
      pad: 0,
    },
	  paper_bgcolor: '#00000000',
	  plot_bgcolor: '#00000000',
    polar: {
      bgcolor: "#00000000", //rgb(223, 223, 223)",
      angularaxis: {
        tickwidth: 1,
        linewidth: 0,
        layer: "below traces",
        direction: "clockwise",
        ticks: "inside",
//        rotate:-90
		    tickfont: {
			    family: ' Tahoma',
			    color: 'grey',
			  },
      },
      radialaxis: {
        side: "clockwise",
        showline: false, //true,
        rotate: 90,
        linewidth: 1,
        tickwidth: 1,
        nticks:6,
        gridcolor: "grey",
        gridwidth: 1,
        tickfont: {
		      family: ' Tahoma',
		      color: 'grey'
			  },
      },
   // paper_bgcolor: "rgb(223, 223, 223)",
    }
  }
  
  Plotly.react(myDiv, datapolar, layoutpolar, config);
}


//Date et H du jour

function sunRsunS(){											// DEBUT - FIN DU JOUR AERO, DATE, HEURE  //sunrise & sunset
 fetch(url)
  .then(response => response.json())
  .then(data => {
    let debut = new Date('July 1, 2024,'+ data.results.sunrise.split(":")[0]+":"+data.results.sunrise.split(":")[1]+":"+data.results.sunrise.split(":")[2]);
    const HeureDeb = new Date();
    HeureDeb.setTime(debut.getTime() - 30*60*1000); // HLOC du début du jour aéro
    let fin = new Date('July 1, 2024,'+ data.results.sunset.split(":")[0]+":"+data.results.sunset.split(":")[1]+":"+data.results.sunset.split(":")[2]);
    const HeureFin = new Date();
    HeureFin.setTime(fin.getTime() + 30*60*1000);  // HLOC de fin du jour aéro
    document.querySelector('#sunriseloc').innerHTML = HeureDeb.toLocaleTimeString(['fr-FR'], { hour: "2-digit", minute: "2-digit" }) + ' LOC';
    document.querySelector('#sunsetloc').innerHTML = HeureFin.toLocaleTimeString(['fr-FR'], { hour: "2-digit", minute: "2-digit" }) + ' LOC';

  })
  .catch(error => console.error('Error:', error))

 fetch(urlUTC)
  .then(response => response.json())
  .then(data => {
    let debututc = new Date('July 1, 2024,'+ data.results.sunrise.split(":")[0]+":"+data.results.sunrise.split(":")[1]+":"+data.results.sunrise.split(":")[2]);
    const HeureDebutc = new Date();
    HeureDebutc.setTime(debututc.getTime() - 30*60*1000); 	// HUTC du début du jour
    let finutc = new Date('July 1, 2024,'+ data.results.sunset.split(":")[0]+":"+data.results.sunset.split(":")[1]+":"+data.results.sunset.split(":")[2]);
    const HeureFinutc = new Date();
    HeureFinutc.setTime(finutc.getTime() + 30*60*1000);	// HUTC fin du jour
    document.querySelector('#sunriseutc').innerHTML = HeureDebutc.toLocaleTimeString(['fr-FR'], { hour: "2-digit", minute: "2-digit" }) + ' UTC';
    document.querySelector('#sunsetutc').innerHTML = HeureFinutc.toLocaleTimeString(['fr-FR'], { hour: "2-digit", minute: "2-digit" }) + ' UTC';
  
  })
  .catch(error => console.error('Error:', error))
  
  const now = new Date();
  const date = now.toLocaleDateString();
  document.getElementById("date").innerHTML = date;
}
