<?php
    ## LOAD CHECK
    if (!isset($username)) trigger_error('Error: missing data when attempting to resume experiment.', E_USER_ERROR);
    
    ## GET PAST EXPERIMENT
    $past = '';
    $scan = scandir("Data/Subj-$username");
    foreach ($scan as $entry) {
        if (substr($entry, 0, 4) === 'exp-') {
            $pastTime = substr($entry, 4, -3);
            $pastDate = date('M j, Y', $pastTime);
            $past .= "<option value='$pastTime'>$pastDate</option>";
        }
    }
    
    ## OUTPUT HTML
?>
<!DOCTYPE html>
<html>
<head>
    <title>Conductor</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="CSS/reset.css">
    <link rel="stylesheet" type="text/css" href="CSS/global.css">
</head>
<body><div>
    <h2>Welcome back!</h2>
    <p>Would you like to resume one of your previous experiments?</p>
    <form method="POST">
        <input type="hidden" name="u" value="<?= $username ?>">
        <select name="t">
        <?= $past ?>
        </select>
        
        <button type="submit">Resume</button>
    </form>
</div></body>
</html>