
<?php
header('Content-Type: application/javascript');
header('Access-Control-Allow-Origin:*');
require_once('../init.php');

?>


const Zterrain = <?= $zAD ?>;
const latitude= <?= $LATITUDE ?>;
const longitude= <?= $LONGITUDE ?>;
const qfu=  <?= $QFUPREF ?>;

const Titre= '<?= $TITREPAGE ?>';
const SousTitre= '<?= $SSTITRE ?>';
const Alerte= '<?= $ALERTE ?>';



