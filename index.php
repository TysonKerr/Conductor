<?php
    #### Determine initial variables

    ## REQUEST, move GET to POST, so we can also use GET to redirect from other experiments
    $requestVars = array('u', 't', 'e', 'c');
    foreach ($requestVars as $v) {
        if (isset($_GET[$v]) AND !isset($_POST[$v])) {
            $_POST[$v] = $_GET[$v];
        }
    }


    ## USERNAME $username, gets username, without error checking, but with filtering
    if (isset($_POST['u'])) {
        // trim username for characters not allowed in filenames
        // not allowed Unix, Mac: \0 (null), \58 (:)
        // not allowed Windows: \0 (null), \1-\31 (non-printing characters), \34 ("), \42 (*), \47 (/), \58 (:), \60 (<), \62 (>), \63 (?), \92 (\), \124 (|)
        // allowed: [ !#$%&'()+,\-.0-9;=@A-Z[\]^_`a-z{}~]
        // problems to avoid: filenames cannot be windows reserved names, regardless of extension: 
        // CON, PRN, AUX, NUL, COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9, LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, and LPT9
        $username = preg_replace('([^ !#$%&\'()+,\\-.0-9;=@A-Z[\\]^_`a-z{}~])', '', $_POST['u']); // remove illegal chars for filenames
        $username = substr(strtolower(trim($username)), 0, 50); // trim, strtolower, max 50 characters
    }


    ## TIME $time, checks if time is sent, else assigns the current time
    if (isset($_POST['t']) &&
        is_numeric($_POST['t']) &&
        $_POST['t'] > 1446349200 &&
        $_POST['t'] <= time())
    {
        $time = (int) $_POST['t'];
    } elseif (isset($username)) {
        // if they are trying to login in, but dont have a valid time, generate one
        $time = time();
    }


    ## EXPERIMENT $experiment, checks if exp is sent, and if it matches one of the valid experiments. Only sets variable if valid
    if (isset($_POST['e'])) {
        $scanExps = scandir('Experiments');
        foreach ($scanExps as $exp) {
            if ($exp === '.' || $exp === '..') continue;
            if (!is_file("Experiments/$exp/Conditions.csv")) continue;
            if ($exp === $_POST['e']) {
                $experiment = $exp;
                break;
            }
        }
    }



    #### Navigate to current script

    ## FIND CURRENT, use input variables to rule out alternatives
    if (isset($username, $_POST['r'])) {
        $current = 'record';
    } elseif (!isset($username) || strlen($username) < 3) {
        $current = 'welcome';
    } elseif (is_file("Data/Subj-$username/exp-$time.js")) {
        $current = 'experiment';    // in the middle of an experiment (probably refreshing or posting data)
    } elseif (!is_dir("Data/Subj-$username")) {
        if (isset($experiment)) {
            $current = 'experiment';    // new user
        } else {
            $current = 'welcome';   // something went wrong? This is weird data, but we can't start an exp without knowing which one to run
        }
    } else {
        $scan = scandir("Data/Subj-$username");
        $oldExpEsists = false;
        foreach ($scan as $entry) {
            if (substr($entry, 0, 4) === 'exp-') {
                $current = 'resume';    // they have some old experiments connected to this username
                $oldExpExists = true;
                break;
            }
        }
        if ($oldExpExists) {
            $current = 'resume';
        } elseif (isset($experiment)) {
            $current = 'experiment';    
        } else {
            $current = 'Welcome';   // something went wrong? This is weird data, but we can't start an exp without knowing which one to run
        }
    }


    ## LOAD CURRENT, load current task's script
    switch ($current) {
        case 'welcome':
            require 'PHP/Welcome.php';
            break;
        
        case 'experiment':
            require 'PHP/Experiment.php';
            break;
        
        case 'resume':
            require 'PHP/Resume.php';
            break;
        
        case 'record':
            require 'PHP/Includes/Record.php';
            break;
        
        default:
            require 'PHP/Error.php';
            break;
    }
