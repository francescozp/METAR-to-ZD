<?php
error_reporting(E_ALL & ~E_NOTICE);
session_start();
/* Detect if the $_SESSION variable has already been set 
(meaning the user has already entered the password during the session) */
if (isset($_SESSION["authed"]) && $_SESSION["authed"] === true) {
    header("location:index.php");
    exit(307);
}

$password = "motdepasse"; // This is where your password goes

if ($_SERVER["REQUEST_METHOD"] == "POST") { // Run code when form is submitted
    if ($_POST["password"] == $password) {
        $_SESSION["authed"] = true; // Set variable to access on protected page
        header("location:index.php"); // Redirect to protected page
        exit(307); // Stop all other scripts
    } else {
        $err = "Le mot de passe n'est pas valide.";
    }
}
?>
<!DOCTYPE html>
<html lang="en-GB">
    <head>
        <title> Entrer le mot de passe </title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Concert+One|Boogaloo">
    </head>
    <body>
        
        <!-- Form with full screen fallback & opacity -->
        <div class="background">
            <form method="POST" action='<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>'>
                <div class="labels" style="text-align: center;">
                    <h1> Page protégée par mot de passe </h1>
                    <h3 style="font-family: arial;"> Merci d'entrer le mot de passe  </h3>
                </div>
                <div class="input-group" style="text-align: center;">
                    <input type="password" name="password" placeholder="Entrer le mot de passe"/>
                    <input type="submit" value="Valider"/><br>
                    <p style="color: red;"><?php echo $err; ?></p>
                </div>
            </form>
        </div>
    </body>
</html>
