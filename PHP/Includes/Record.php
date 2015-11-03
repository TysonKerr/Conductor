<?php
    # make sure we should be here, and have the data necessary to actually run this page
    if (!isset($username, $time)) trigger_error('Error: missing data when attempting to record experiment.', E_USER_ERROR);
    
    $expFile  = "Data/Subj-$username/exp-$time.js";
    $respFile = "Data/Subj-$username/resp-$time.csv";
    
    if (!is_file($expFile)) trigger_error("Exp File '$expFile' not found", E_USER_ERROR);



    # Prepare function to add data to csv
    ini_set('html_errors', false);
    ini_set('auto_detect_line_endings', true);
    
    function csvAddRow ($filename, $row) {
        $dir = dirname($filename);
        if (!is_dir($dir)) mkdir($dir, 0777, true);
        
        if (mb_detect_encoding(implode('', $row), 'UTF-8', TRUE)) {
            foreach ($row as &$datum) {
                $datum = mb_convert_encoding($datum, 'Windows-1252', 'UTF-8');
            }
            unset($datum);
        }
        
        foreach ($row as &$datum) {
            $datum = str_replace(array("\r\n", "\n", "\t", "\r", chr(10), chr(13)), ' ', $datum);
        }
        unset($datum);
        
        if (!is_file($filename)) {
            $file = fopen($filename, "w");
            fputcsv($file, array_keys($row));
            fputcsv($file, $row);
        } else {
            $file = fopen($filename, "r+");
            $headers = array_flip(fgetcsv($file));
            $newHeaders = array_diff_key($row, $headers);
            if ($newHeaders !== array()) {
                $headers = $headers+$newHeaders;
                $oldData = stream_get_contents($file);
                rewind($file);
                fputcsv($file, array_keys($headers));
                fwrite($file, $oldData);
            }
            fseek($file, 0, SEEK_END);
            $rowSorted = array();
            foreach ($headers as $col => $nothing) {
                if (isset($row[$col])) {
                    $rowSorted[$col] = $row[$col];
                } else {
                    $rowSorted[$col] = '';
                }
            }
            fputcsv($file, $rowSorted);
        }
        
        fclose($file);
    }



    # decode data, record into CSV
    $data = json_decode($_POST['r'], true);
    foreach ($data as $row) {
        csvAddRow($respFile, $row);
    }
    
