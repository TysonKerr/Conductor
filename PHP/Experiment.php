<?php
    #### LOAD CHECK, determine if we belong here
    if (!isset($username, $time)) {
        trigger_error('Error: missing data when attempting to run experiment.', E_USER_ERROR);
    }


    #### FILE LIST, list files this experiment will need
    $expFile      = "Data/Subj-$username/exp-$time.js";
    $respFile     = "Data/Subj-$username/resp-$time.csv";
    $allTypesFile = "JS/trialTypes.js";


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
        if ($type === '.' || $type === '..') continue;
        if (substr($type, -3) === '.js') {
            $types[$type] = filemtime("TrialTypes/$type");
        } elseif (is_dir("TrialTypes/$type")) {
            $typeFiles = scandir("TrialTypes/$type");
            foreach ($typeFiles as $file) {
                if ($file === '.' || $file === '..') continue;
                $types["$type/$file"] = filemtime("TrialTypes/$type/$file");
            }
        }
    }
    if (!is_file($allTypesFile)) {
        $mergeTypes = true;
    } elseif (max($types) >= filemtime($allTypesFile)) {
        $mergeTypes = true;
    }
    
    if ($mergeTypes) {
        $combined = 'var trialTypes = {};' . "\n\n";
        $typeFolders = array();
        foreach ($types as $type => $filemtime) {
            $slashPos = strpos($type, '/');
            if ($slashPos !== false) {
                $typeFolders[substr($type, 0, $slashPos)][] = $type;
                continue; // process these later, down below
            }
            if (substr($type, -3) !== '.js') continue;  // dont include files that are just notes or images or whatever
            $combined .= file_get_contents("TrialTypes/$type")."\n";
        }
        
        foreach ($typeFolders as $type => $files) {
            $trialCode = "window['trialTypes']['$type'] = {\n";
            foreach ($files as $file) {
                $filename = substr($file, strpos($file, '/')+1);
                $extPos = strrpos($filename, '.');
                $ext = '';
                if ($extPos !== false) {
                    $ext = substr($filename, $extPos);
                    $filename = substr($filename, 0, $extPos);
                }
                if ($ext === '.php') {
                    ob_start();
                    include "TrialTypes/$file";
                    $fileContents = ob_get_clean();
                } else {
                    $fileContents = file_get_contents("TrialTypes/$file");
                }
                
                if ($ext !== '.js') {
                    // a couple things I'm doing here
                    // first, escape quotes, so that they dont disrupt `var str = "inner \"quotes\"";
                    // then, replace all newline types with a standard kind
                    // then, break newlines into separate javascript lines, while also keeping the newlines inside the string
                    // this way, if a string is meant for a <pre> kind of display, the internal newlines will be preserved
                    // furthermore, when looking at the code in a debugger tool, the new lines should also be displayed as newlines
                    $fileContents = addslashes($fileContents);
                    $fileContents = str_replace(array("\r\n", "\r", "\n"), "\n", $fileContents);
                    $fileContents = str_replace("\n", "\\n'+\n    '", $fileContents);
                    $fileContents = "    return ''+\n    '$fileContents';\n";
                }
                
                $trialCode .= "  $filename: function() {\n"
                           .       $fileContents
                           .  "  },\n";
            }
            $trialCode .= "}\n\n";
            $combined  .= $trialCode;
        }
        file_put_contents($allTypesFile, $combined);
    }
    
    $typeModTime = filemtime($allTypesFile); // append this to js src, so that we dont use cached code


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
    <script src="<?= "$allTypesFile?m=$typeModTime" ?>"></script>
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
