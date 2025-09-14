# METAR-to-ZD
From METAR to your website to display density altitude

_Density altitude is an essential parameter in flight preparation, especially when it is high. It directly influences aircraft performance, particularly during takeoff and landing. Density altitude increases with altitude and temperature, thereby reducing performance. In order to improve its members' awareness of the situation, the [Méribel flying club](http://www.ac-meribel.com), which is particularly concerned as it is located at 5640 ft,
has developed a tool for measuring and displaying density altitude in real time in the club's premises, under the impetus of its president, Jean-François Grammont._

_To facilitate the display of altitude-density in the premises of clubs located at airfields equipped with aeronautical meteorological information (METAR), the flying club has developed a tool that retrieves METAR data and displays it on the web page hosted by the club's website or on the club's kiosk or Smile TV FFA!_

_This document explains how to set up this altitude-density display using METAR data. The entire system was designed and developed on a voluntary basis by the Méribel flying club and is available free of charge to clubs on Github METAR-to-ZD. This project can be set up quickly and only takes a few hours; it costs nothing to the flying club that implements it._

<img width="1620" height="923" alt="Capture d’écran 2025-09-13 à 14 43 58" src="https://github.com/user-attachments/assets/16941f92-6ea3-4fea-a31a-d29b20db6d33" />


## Introduction
Density altitude determines aircraft performance. It is an essential parameter for flight preparation, particularly in summer or when flying from an airport located at high altitude. When weather information is available at the airport, it needs to be interpreted in order to determine the density altitude.

In fact, there does not appear to be any reasonably priced off-the-shelf device for displaying density altitude in Europe. In the United States, a few devices exist and are generally located near holding points at high-altitude aerodromes, and display density altitude. However, these devices are expensive and their maintenance is uncertain in Europe, where they do not appear to be distributed.

The Méribel flying club has therefore developed a stand-alone display and derived a display using METAR data.

This solution aims to retrieve METAR data from the aerodrome as soon as it is published and use it to display the density altitude, the temperature deviation from the standard atmosphere, and a 3-day history of the data collected. This solution only requires a desktop computer connected to the Internet and an Internet server (the one hosting the flying club's website, for example). Three steps are necessary to implement this solution, the fastest in this guide:
1. Create a free account on an online data storage table in order to store data as it is collected to have a history (of
temperature, QNH, wind, etc.).
2. Download the necessary files from Github and customize the init.php file with your field data (altitude, name, coordinates, etc.).
3. Install the results and data consultation folders on the server of the flying club's website.

## 1. Create an account and a table on Baserow
This operation aims to create a free online database to store the collected METAR data, in order to display the history of the parameters.

In this way, the data is then stored directly on the servers of this database and is therefore easily accessible via the data consultation page that will be set up at the end of this tutorial.

By visiting the [Baserow page](https://baserow.io/), you can easily open a free account by clicking on “Sign up” in the top right-hand corner. Once the account has been created, the home page of your [Baserow](https://baserow.io/) space will be displayed.

### 1.1. Creating a Baserow.io table
Click on the “+ Add” button in the top right corner, then on “Database” to create a new database. In the window that opens, select “Blank database,” give it a name (without spaces), and confirm by clicking on “Add database.”

The database will then appear in the vertical menu on the left, with a table. Click on the table, which will then be displayed in the center of the page. We will now create the different columns we will need:
1. Click on the down arrow to the right of the name of the first column. Then choose to modify the field, rename it `Date`, click on the field type to choose “Date” (check include time, in 24-hour format). This way, each row in this table will start with the date and time the row was created, which will be filled in automatically
2. Click on the arrow to the right of the second column (or on the “+” sign to the right of the last column), click on edit field, enter `QNH` for the name of the column and select “number” for the field type. You can choose the precision (select 0 decimal places as it is an integer).
3. Click on the arrow to the right of the third column (or on the “+” sign to the right of the last column), click on edit field, enter `HUM` for the name of the column (humidity) and select “number” for the field type. You can select the precision (select 0 decimal places as it is an integer).
4. Repeat the same steps to create the columns `TEMP` (temperature), `DP` (dew point), `ZD` (altitude-density), `VW` (wind speed)
5. Click on the “+” sign to the right of the last column, click on edit field, enter `Wdir` for the column name (wind direction) and choose "text (one line)" for the field type, which can take the value ‘VRB’.
6. Finally, click on the “+” sign to the right of the last column, click on “Modify Field,” enter `ZP` for the column name (altitude pressure), and select “Number” for the field type. You can choose the precision (select 0 decimal places since it is an integer).

You should now see a table with 9 columns: `Date`, `QNH`, `HUM`, `TEMP`, `DP`, `ZD`, `VW`, `Wdir`, `ZP`.

### 1.2. API access to the table
The purpose of this section is to enable your data recording and consultation device to access this data via an application programming interface (API). Once this table has been created, you need to enable API access to it.

To do this, simply click on “XXX Workspace” in the top left corner, where XXX corresponds to your initials or your name, then click on “My Account.” In the window that opens, click on “Database access tokens” in the menu on the left. Click on the blue “Create Token” button at the top right, give it a name (`TOKEN_NAME`), choose the project (normally the account only has one project at this stage) and confirm by clicking on “Create Token”. On the page that appears, you will see the name of the token (which you just entered) and the permissions, all of which must be valid (create, read, modify, delete). On this page, click on the three dots (...) next to the name of the token you have just created (`TOKEN_NAME`); a small window will open, displaying:
+ “Token” and a series of points, which correspond to the API password for accessing the data (`API_KEY`): click on the “copy” icon to the right of the line and paste this
password in a safe place.
+ API documentation, which allows you to view the different ways to use the API in your space. In this documentation, you will find the database ID (which is not used in this project) and the table ID
(`TABLE_ID`).

With these two elements (`API_KEY` and `TABLE_ID`), you can now access the table you created on Baserow with an API. If you wish, you can test the API with [Postman](https://www.postman.com/) by creating a free account. This test is not essential for this project.

## 2. Download the file from GitHub
Download the current METAR-to-ZD `ACMeteo` folder on your computer. Once the folder has been downloaded to your computer, unzip it and check that the `ACMeteo` folder contains two subfolders:

**The altidensite folder** contains the `init.php` file, in which you will enter the data relating to your airfield and the display of data, by opening this file with a code editor ([Geany](https://www.geany.org), for example, which is free) and saving your changes:
```
// Aerodrome
$AD = ’ LFXX ’;                         // ICAO Code of your AD equipped with METAR
$zAD =1111;                             // Your AD altitude in feet
$LATITUDE = 45.929852;                  // Google maps coordinates of you AD
$LONGITUDE =6.099621;
$QFUPREF =232;                          // QFU of the preferential runway of you AD

// Baserow
$TABLENUM = 123456;                     // TABLE_ID of your Baserow table
$APIKEY = ’sAmPlEaPiKeY123’;            // API_KEY of your Baserow database

// Webpage display
$TITREPAGE = ’Aeroclub des sommets’;    // Title of the webpage displaying the results
$SSTITRE = ’Aerodrome des montagnes’;   // Subtitle of the webpage
$ALERTE = ’WARNING’;                    // Possible warning message on the webpage
```

This folder also contains a scripts folder which contains the scripts needed to connect to the database, retrieve and save data. This folder contains, in particular, the `data-feed.php` file, a PHP script that retrieves METAR weather data from the US National Weather Service API (free and no registration required) and saves this data to an online database (baserow.io).

**The www folder** contains all the files and scripts needed to display the data on a web page hosted on the club's server. The `img` folder contains illustrations (clock faces, sun, etc.), while the `resources` folder contains scripts for retrieving data from Baserow and formatting it for display on the web page.

This folder also contains three files: `index.php` is the data display page, which will be displayed from your club's server. This page can be protected by a simple password. To do this, simply uncomment the first three lines of code on this page. The password requested appears in the `auth.php` file, on the line `$password =`. Finally, the `logout.php` file manages the session duration after logging in with a password, as well as redirection to the password request page. This security measure is very basic and can be improved by another system that you may eventually implement.

## 3. [optional] Test the functionality on a local computer.
So if you have a computer with a local server (Apache), everything should work normally. In the folder corresponding to the server's localhost (where the Apache default page is located), simply place the `ACMeteo` folder downloaded from GitHub, which you have previously customized with your data in the `ACMeteo` ▶ `altidensite` ▶ `init.php` file (see previous paragraph).

Then open a browser and type `localhost/ACMeteo/www/meteo`: normally the altitude-density display page (`index.php`) will open (or access it if localhost shows the tree structure) and the display will work.
Next, to test data recording locally, just open a terminal and type something like:
```
‘wget -O/dev/null -q http://localhost/ACMeteo/altidensite/scripts/data-feed.php’
```
which will normally call the METAR API and record the data on Baserow. To make sure the command worked, return to the open data display page in your browser and refresh the page to see how recent the data is ("the most recent data displayed was recorded today at XX:XX UTC). You can also open Baserow and see if data has been successfully recorded in your table.

## 4. Installation on an Internet server
This section completes the installation of the system by hosting the necessary files on the flying club's server.

### 4.1. Automate data collection
On the server hosting your club's website, place the `altidensite` folder and everything it contains at the same level as the publicly accessible folder (usually `www` or `public`). Data collection is performed by the `data-feed.php` script in the `altidensite/scripts` folder. Then consult your host's documentation (here is the [OVH documentation](https://help.ovhcloud.com/csm/fr-web-hosting-automated-tasks-cron?id=kb_article_view&sysparm_article=KB0052534), for example) to find out how to launch programs automatically (cronjobs or cron) so that the `data-feed.php script` runs at 04 minutes and 34 minutes past every hour (METAR data is available online at 03 minutes and 33 minutes past every hour), which may require creating two tasks, one at 04 minutes and the other at 34 minutes, which execute the same `data-feed.php` script.

To check that your cronjob is working, wait 30 minutes or 1 hour and consult your Baserow table: if the cronjob is working, you should see the recorded data appear.

### 4.2. Setting up the display
In your server's publicly accessible folder (`www` or `public`), where your website is stored, paste the meteo folder you previously downloaded from GitHub (in `ACMeteo` ▶ `www` ▶ `meteo`) and customized with your settings (club name, contact details, etc.). The path to this folder on your server should then look like / ▶ `www` ▶ `meteo` (with no other folders between the publicly accessible www folder and the meteo folder). There is no further action required at this stage.

### 4.3. Viewing the display page
To view the data display page, assuming your club's website address is `www.monaeroclub.fr/`, simply open a browser and type `www.monaeroclub.fr/meteo` in the address bar. 

Congratulations, your system is up and running! You can now create a link to this page from your website, or integrate this page into your Smile TV FFA display. Feel free to share this new source of information with your members to improve awareness of everyone's situation.

Happy flying!
