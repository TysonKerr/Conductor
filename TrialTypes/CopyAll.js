window['trialTypes']['CopyAll'] = {
    style: function() {
        return ".trial.CopyAll { font-size: 200%; text-align: center; font-family: Arial; } "
             + ".trial.CopyAll div { margin: 15px; } "
             + ".trial.CopyAll span { display: inline-block; width: 48%; } "
             + ".trial.CopyAll span:nth-child(1) { text-align: right; } "
             + ".trial.CopyAll span:nth-child(2) { width: 2%; } "
             + ".trial.CopyAll span:nth-child(3) { text-align: left; } "
             + ".trial.CopyAll input { font-size: 100%; font-family: inherit; margin: -1px; }";
    },
    
    htmlTemplate: function() {
        return "<div>"
             +    "<span>{Cue}</span>"
             +    "<span>:</span>"
             +    "<span>{Target}</span>"
             + "</div>"
             + "<div>"
             +    "<span>{Cue}</span>"
             +    "<span>:</span>"
             +    "<span><input type='text' name='Response[]'></span>"
             + "</div>";
    },
    
    prepareHTML: function() {
        var cues = this.inputs["Cue"].split('|');
        var tars = this.inputs["Target"].split('|');
        
        var html = "", htmlBlock;
        var template = this.htmlTemplate();
        var i, len;
        for (i=0, len=cues.length; i<len; ++i) {
            htmlBlock = template;
            htmlBlock = htmlBlock.replace(/{Cue}/g,    cues[i]);
            htmlBlock = htmlBlock.replace(/{Target}/g, tars[i]);
            html += htmlBlock;
        }
        html += "<button type='Submit'>Submit</button>";
        this.container.html(html);
    }
}
