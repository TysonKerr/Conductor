<?php
    #### LOAD CHECK, setermine if we belong here
    if (!isset($username, $time)) {
        trigger_error('Error: missing data when attempting to run experiment.', E_USER_ERROR);
    }


    #### FILE LIST, list files this experiment will need
    $expFile  = "Data/Subj-$username/exp-$time.js";
    $respFile = "Data/Subj-$username/resp-$time.csv";
    $typeFile = "JS/trialTypes.js";


    #### CREATE EXPERIMENT, if we haven't created the experiment yet, do so now
    if (!is_file($expFile)) {
        require 'PHP/Includes/createExperiment.php';
    }


    #### LOAD RESPONSES, if we already have some responses, prepare to send them back to the client
    if (!is_file($respFile)) {
        $respData = '[]';
    } else {
        // don't bother parsing file, just send it to JS, let client parse into correctly associated object
        $respFileRes = fopen($respFile, 'r');
        if ($respFileRes === false) trigger_error("Failed to open resp file '$respFile'", E_USER_ERROR);
        $respData = array();
        while ($line = fgetcsv($respFileRes)) {
            $respData[] = $line;
        }
        $respData = json_encode($respData);
    }


    #### TRIAL TYPES, check if the trial type JS needs to be re-merged from all the individual files in TrialTypes/
    $mergeTypes = false;
    $types = scandir('TrialTypes');
    foreach ($types as $i => $type) {
        unset($types[$i]);
        if (substr($type, -3) === '.js') {
            $types[$type] = filemtime("TrialTypes/$type");
        }
    }
    if (!is_file($typeFile)) {
        $mergeTypes = true;
    } elseif (max($types) >= filemtime($typeFile)) {
        $mergeTypes = true;
    }
    
    if ($mergeTypes) {
        $combined = '';
        foreach ($types as $type => $filemtime) {
            $combined .= file_get_contents("TrialTypes/$type")."\n";
        }
        file_put_contents($typeFile, $combined);
    }
    
    $typeModTime = filemtime($typeFile); // append this to js src, so that we dont use cached data and lose responses


    #### OUTPUT HTML
?>
<!DOCTYPE html>
<html>
<head>
    <title>Conductor</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="CSS/reset.css">
    <link rel="stylesheet" type="text/css" href="CSS/global.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="JS/Experiment.js"></script>
    <script src="<?= $expFile ?>"></script>
    <script src="<?= "$typeFile?m=$typeModTime" ?>"></script>
    <script>
        var loginData = {
            u : "<?= $username ?>",
            t : "<?= $time ?>",
        }
        var resp = <?= $respData ?>;
    </script>
</head>
<body><div id="display">
    <div id="LoadingMessage">Let's begin!</div>
</div></body>
</html>
