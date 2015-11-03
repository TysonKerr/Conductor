var TestAll = {
    addCSS : function() {
        return ".trial.TestAll { font-size: 200%; text-align: center; font-family: Arial; } "
             + ".trial.TestAll div { margin: 15px; } "
             + ".trial.TestAll span { display: inline-block; width: 48%; } "
             + ".trial.TestAll span:nth-child(1) { text-align: right; } "
             + ".trial.TestAll span:nth-child(2) { width: 2%; } "
             + ".trial.TestAll span:nth-child(3) { text-align: left; } "
             + ".trial.TestAll input { font-size: 100%; font-family: inherit; margin: -1px; }";
    },
    
    prepareHTML: function() {
        var cues = this.inputs["Cue"].split('|');
        var tars = this.inputs["Target"].split('|');
        var sep = ":";
        var inp = "<input type='text' name='Response[]'>";
        
        var html = "";
        var i, len;
        var cue, tar;
        for (i=0, len=cues.length; i<len; ++i) {
            cue = cues[i];
            tar = tars[i];
            html += "<div>"
                 +     "<span>"+cue+"</span>"
                 +     "<span>"+sep+"</span>"
                 +     "<span>"+inp+"</span>"
                 +  "</div>"
        }
        html += "<button type='Submit'>Submit</button>";
        this.container.html(html);
    }
}
