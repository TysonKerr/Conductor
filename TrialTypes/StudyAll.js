var StudyAll = {
    addCSS : function() {
        return ".trial.StudyAll { font-size: 200%; text-align: center; } "
             + ".trial.StudyAll span { display: inline-block; width: 48%; } "
             + ".trial.StudyAll span:nth-child(1) { text-align: right; } "
             + ".trial.StudyAll span:nth-child(2) { width: 2%; } "
             + ".trial.StudyAll span:nth-child(3) { text-align: left; } ";
    },
    
    prepareHTML: function() {
        var cues = this.inputs["Cue"].split('|');
        var tars = this.inputs["Target"].split('|');
        var sep = ":";
        
        var html = "";
        var i, len;
        var cue, tar;
        for (i=0, len=cues.length; i<len; ++i) {
            cue = cues[i];
            tar = tars[i];
            html += "<div>"
                 +     "<span>"+cue+"</span>"
                 +     "<span>"+sep+"</span>"
                 +     "<span>"+tar+"</span>"
                 +  "</div>"
        }
        html += "<button type='Submit'>Submit</button>";
        this.container.html(html);
        this.container.html(html);
    }
}
