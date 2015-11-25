window['trialTypes']['CuedLetterStem'] = {
    style: function() {
        return ".trial.CuedLetterStem { font-size: 200%; text-align: center; font-family: Arial; } "
             + ".trial.CuedLetterStem div { margin: 15px; } "
             + ".trial.CuedLetterStem span { display: inline-block; width: 48%; } "
             + ".trial.CuedLetterStem span:nth-child(1) { text-align: right; } "
             + ".trial.CuedLetterStem span:nth-child(2) { width: 2%; } "
             + ".trial.CuedLetterStem span:nth-child(3) { text-align: left; } "
             + ".trial.CuedLetterStem input { font-size: 100%; font-family: inherit; margin: -1px; } ";
    },
    
    htmlTemplate: function() {
        return "<div>"
             +     "<span>[cue]</span>"
             +     "<span>:</span>"
             +     "<span>{target stem}<input type='text' name='Response'></span>"
             + "</div>"
             + "<button type='Submit'>Submit</button>";
    },
    
    prepareHTML: function() {
        var html       = this.htmlTemplate();
        var stemLength = this.inputs["Stem Length"];
        var tarStem    = this.inputs["Target"].substr(0, stemLength);

        html = fillHtmlTemplate(html, this.inputs);
        html = html.replace('{target stem}', tarStem);

        this.container.html(html);
    },
    
    end: function() {
        var tar  = this.inputs["Target"];
        var resp = this.recorded["Response"];
        var stemLength;
        stemLength = this.inputs["Stem Length"];
        stemLength = parseInt(stemLength);

        tar  = tar.trim().toLowerCase();
        resp = resp.trim().toLowerCase();

        if (resp === tar || resp === tar.substr(stemLength)) {
            this.recorded["Accuracy"] = 1;
        } else {
            this.recorded["Accuracy"] = 0;
        }
    }
}