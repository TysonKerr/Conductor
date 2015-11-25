window['trialTypes']['Test'] = {
    style: function() {
        return ".trial.Test { font-size: 200%; text-align: center; font-family: Arial; } "
             + ".trial.Test div { margin: 15px; } "
             + ".trial.Test span { display: inline-block; width: 48%; } "
             + ".trial.Test span:nth-child(1) { text-align: right; } "
             + ".trial.Test span:nth-child(2) { width: 2%; } "
             + ".trial.Test span:nth-child(3) { text-align: left; } "
             + ".trial.Test input { font-size: 100%; font-family: inherit; margin: -1px; }";
    },
    
    htmlTemplate: function() {
        return "<div>"
             +    "<span>[Cue]</span>"
             +    "<span>:</span>"
             +    "<span><input type='text' name='Response'></span>"
             + "</div>"
             + "<button type='Submit'>Submit</button>";
    },
    
    end: function() {
        var tar = this.inputs["Target"];
        var resp = this.recorded["Response"];
        if (tar.trim().toLowerCase() === resp.trim().toLowerCase()) {
            this.recorded["Accuracy"] = 1;
        } else {
            this.recorded["Accuracy"] = 0;
        }
    }
}
