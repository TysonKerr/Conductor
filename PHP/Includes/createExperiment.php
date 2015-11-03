<?php
    #### LOAD CHECK
    if (!isset($username, $time, $experiment)) {
        trigger_error('Error: missing data when attempting to create experiment.', E_USER_ERROR);
    }


    #### PREPARE FILE FUNCTION
    ini_set('auto_detect_line_endings', true);
    
    function readCsv($filename) {
        if (substr(strtolower(trim($filename)), 0, 4) === 'http') {
            trigger_error(__FUNCTION__."($filename): Cannot open URLs", E_USER_WARNING);
            return false;
        }
        $fileResource = fopen($filename, 'r');
        if ($fileResource === false) return false;
        $output = array();
        $headers = fgetcsv($fileResource);
        while ($line = fgetcsv($fileResource)) {
            $isEmpty = true;
            foreach ($line as $i => $field) {
                $line[$i] = trim($field);
                if ($line[$i] !== '') $isEmpty = false;
            }
            if (!$isEmpty) {
                $row = array();
                foreach ($headers as $i => $head) {
                    $row[$head] = isset($line[$i]) ? $line[$i] : '';
                }
                $output[] = $row;
            }
        }
        if (count($output) < 2) {
            trigger_error(__FUNCTION__."($filename): Cannot load file: "
                        . "Insufficient data inside", E_USER_WARNING);
            return false;
        }
        return $output;
    }



    #### CONDITION

    ## LOAD CONDITION FILE
    $conditionsFile = "Experiments/$experiment/Conditions.csv";
    
    $conditions = readCsv($conditionsFile);


    ## ERROR CHECK CONDITION FILE
    // error checking the conditions file
    // must be a readable file, with a row of headers and at least 1 row of data
    // must have a Procedure1 column
    // all ProcedureX and StimuliX must not contain ".."
    if ($conditions === false) trigger_error("Cannot use Conditions file '$conditionsFile'", E_USER_ERROR);
    $conditionRow = $conditions[0];
    if (!isset($conditionRow['Procedure1'])) trigger_error("Conditions file '$conditionsFile' must contain column 'Procedure1'", E_USER_ERROR);
    $fileColumns = array();
    $i = 1;
    while (isset($conditionRow["Procedure$i"])) {
        $fileColumns[] = "Procedure$i";
        ++$i;
    }
    $i = 1;
    while (isset($conditionRow["Stimuli$i"])) {
        $fileColumns[] = "Stimuli$i";
        ++$i;
    }

    $badFields = array();
    foreach ($conditions as $i => $row) {
        foreach ($fileColumns as $col) {
            if (strpos($row[$col], '..') !== false) {
                $badFields[] = 'Row: ' . ($i+2) . '; Col: "' . $col . '"; Entry: "' . $row[$col] . '"';
            }
        }
    }
    if ($badFields !== array()) {
        trigger_error("Invalid values in conditions file '$conditionsFile': Cannot contain '..'", E_USER_WARNING);
        foreach ($badFields as $bad) {
            trigger_error($bad, E_USER_WARNING);
        }
        trigger_error("Cannot proceed until conditions file '$conditionsFile' is fixed", E_USER_ERROR);
    }


    ## CHOOSE CONDITION ROW
    unset($condition);  // just in case something else set it earlier at index.php
    
    if (isset($_POST['c'])) {
        # USE CHOSEN CONDITION
        if (!isset($conditions[$_POST['c']])) {
            trigger_error('Error: bad condition requested for new experiment.', E_USER_ERROR);
        }
        
        $condition = $conditions[$_POST['c']];
    } else {
        # USE RANDOM ASSIGNMENT
        $assignmentFile = "Data/exp-$experiment/assignments.txt";
        
        if (is_file($assignmentFile)) {
            $assignments = file_get_contents($assignmentFile);
            if ($assignments === false) {
                trigger_error("Error: cannot access assignment file '$assignmentFile'", E_USER_ERROR);
            }
            
            $assignments = explode(',', $assignments);
        
            // its possible that the condition file has changed since the assignments were arranged
            // so, the file could say that the next assignment is condition 5, which doesnt exist anymore
            // in that case, just skip it, and try the next assignment
            while ($assignments !== array()) {
                $conditionIndex = array_pop($assignments);
                if (isset($conditions[$conditionIndex])) {
                    $condition = $conditions[$conditionIndex];
                    break;
                }
            }
        }
        
        // if there was no assignment file, or the assignment file didn't have a usable condition inside
        if (!isset($condition)) {
            $assignments = array_keys($conditions);
            shuffle($assignments);
            $conditionIndex = array_pop($assignments);
            $condition = $conditions[$conditionIndex];
        }
        
        // dont write blank assignments, since that will end up trying to assign condition ''
        if ($assignments === array()) {
            $assignments = array_keys($conditions);
            shuffle($assignments);
        }
        
        $assignments = implode(',', $assignments);  // put the rest back into the file for the next subject
        $assignmentFileDir = dirname($assignmentFile);
        if (!is_dir($assignmentFileDir)) {
            mkdir($assignmentFileDir, 0777, true);
        }
        file_put_contents($assignmentFile, $assignments);
    }



    #### LOAD DATA
    
    ## GET STIM AND PROC FILES
    $files = array('Procedure' => array(), 'Stimuli' => array());
    foreach ($files as $fileType => &$list) {
        $i = 1;
        while (isset($condition[$fileType . $i])) {
            if ($condition[$fileType . $i] !== '') {
                $list[] = $condition[$fileType . $i];
            }
            ++$i;
        }
    }
    if ($files['Procedure'] === array()) {
        trigger_error('Condition Row ' . ($conditionIndex+2) . " for file '$conditionsFile' must have at least 1 procedure column that isn't blank.", E_USER_ERROR);
    }
    unset($list);

    ## LOAD STIM AND PROC FILES
    // assemble all the files into a single object (assoc array in PHP)
    $expData = array('Procedure' => array(), 'Stimuli' => array());
    
    # LOAD PROC
    foreach ($files['Procedure'] as $procFile) {
        $procData = readCsv("Experiments/$experiment/Procedures/$procFile.csv");
        // TODO: validate proc data here - actually, move this to the JS
        if ($procData === false) trigger_error("Procedure file '$procFile' failed to load", E_USER_ERROR);
        if (!isset($procData[0]['Type'])) {
            trigger_error("Procedure file '$procFile' is missed a 'Type' column, which is required", E_USER_ERROR);
        }
        // TODO: shuffle proc data here
        foreach ($procData as $row) {
            $expData['Procedure'][] = $row;
        }
    }
    
    # LOAD STIM
    foreach ($files['Stimuli'] as $i => $stimFile) {
        $stimData = readCsv("Experiments/$experiment/Stimuli/$stimFile.csv");
        // TODO: validate stim data here - actually, move this to the JS
        if ($stimData === false) trigger_error("Procedure file '$procFile' failed to load", E_USER_ERROR);
        // TODO: shuffle stim data here
        $expData['Stimuli'][$i] = $stimData;
    }



    #### CREATE EXPERIMENT FILE
    // create js file
    // file names defined at the top of Experiment.php
    $expData = 'var expData = ' . json_encode($expData) . ";\n";    // end on a newline
    $expFileDir = dirname($expFile);
    if (!is_dir($expFileDir)) mkdir($expFileDir, 0777, true);
    file_put_contents($expFile, $expData);
