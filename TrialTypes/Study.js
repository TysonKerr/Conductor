window['trialTypes']['Study'] = {
    style: function() {
        return ".trial.Study { font-size: 200%; text-align: center; } "
             + ".trial.Study span { display: inline-block; width: 48%; } "
             + ".trial.Study span:nth-child(1) { text-align: right; } "
             + ".trial.Study span:nth-child(2) { width: 2%; } "
             + ".trial.Study span:nth-child(3) { text-align: left; } ";
    },
    
    htmlTemplate: function() {
        return "<div>"
             +    "<span>[Cue]</span>"
             +    "<span>:</span>"
             +    "<span>[Target]</span>"
             + "</div>"
             + "<button type='Submit'>Submit</button>";
    },
}
