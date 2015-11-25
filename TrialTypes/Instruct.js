window['trialTypes']['Instruct'] = {
    style: function() {
        return ".trial.Instruct > div { width: 800px; margin: 0 auto; }"
             + ".trial.Instruct button { margin-top: 10px; }";
    },
    
    htmlTemplate: function() {
        return "<div>[Text]</div>"
             + "<button type='Submit'>Next</button>";
    },
}
