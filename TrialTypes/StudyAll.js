window['trialTypes']['StudyAll'] = {
    style: function() {
        return ".trial.StudyAll { font-size: 200%; text-align: center; } "
             + ".trial.StudyAll span { display: inline-block; width: 48%; } "
             + ".trial.StudyAll span:nth-child(1) { text-align: right; } "
             + ".trial.StudyAll span:nth-child(2) { width: 2%; } "
             + ".trial.StudyAll span:nth-child(3) { text-align: left; } ";
    },
    
    htmlTemplate: function() {
        return "<div>"
             +    "<span>{Cue}</span>"
             +    "<span>:</span>"
             +    "<span>{Target}</span>"
             + "</div>"
    },
    
    prepareHTML: function() {
        var cues = this.inputs["Cue"].split('|');
        var tars = this.inputs["Target"].split('|');
        
        var html = "", htmlBlock;
        var template = this.htmlTemplate();
        var i, len;
        for (i=0, len=cues.length; i<len; ++i) {
            htmlBlock = template;
            htmlBlock = htmlBlock.replace("{Cue}",    cues[i]);
            htmlBlock = htmlBlock.replace("{Target}", tars[i]);
            html += htmlBlock;
        }
        html += "<button type='Submit'>Submit</button>";
        this.container.html(html);
    }
}
