<?php
    $conditionSelection = true;
?><!DOCTYPE html>
<html>
<head>
    <title>Conductor</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="CSS/reset.css">
    <link rel="stylesheet" type="text/css" href="CSS/global.css">
</head>

<body id="Welcome">
<div>
<h2>Welcome!</h2>
<form method="POST" autocomplete="off">
    <div>Please enter your username, participant ID, or Mechanical Turk Worker ID below.</div>
    <?php if (isset($username) && strlen($username) < 3) echo '<div>Usernames must be at least 3 characters long.</div>'; ?>
    <input type="text"   name="u" id="usernameInput" autofocus>
    <input type="hidden" name="t" value="<?= time() ?>">
    <?php
        if (isset($experiment)) {
            echo '<input type="hidden" name="e" value="' . $experiment . '">';
        } else {
            echo '<select name="e">';
            $scanExps = scandir('Experiments');
            foreach ($scanExps as $exp) {
                if ($exp === '.' || $exp === '..') continue;
                if (!is_file("Experiments/$exp/Conditions.csv")) continue;
                echo "<option>$exp</option>";
            }
            echo '</select>';
        }
        if (isset($condition)) {
            echo '<input type="hidden" name="c" value="' . $condition . '">';
        } elseif ($conditionSelection === true) {
            // TODO: have each experiment look up the number of conditions, then use javascript to rearrange the condition select based on currently selected exp
            // similar to what I had for Template for selection session
            echo '<select name="c">';
            echo     '<option>0</option>';
            echo     '<option>1</option>';
            echo     '<option>2</option>';
            echo '</select>';
        }
    ?>
    <button type="submit" id="usernameSubmit">Submit</button>
</form>
</div>
</body>
</html>
