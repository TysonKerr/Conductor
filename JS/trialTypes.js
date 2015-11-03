var Copy = {
    addCSS : function() {
        return ".trial.Copy { font-size: 200%; text-align: center; font-family: Arial; } "
             + ".trial.Copy div { margin: 15px; } "
             + ".trial.Copy span { display: inline-block; width: 48%; } "
             + ".trial.Copy span:nth-child(1) { text-align: right; } "
             + ".trial.Copy span:nth-child(2) { width: 2%; } "
             + ".trial.Copy span:nth-child(3) { text-align: left; } "
             + ".trial.Copy input { font-size: 100%; font-family: inherit; margin: -1px; }";
    },
    
    prepareHTML: function() {
        var cue = this.inputs["Cue"];
        var tar = this.inputs["Target"];
        var sep = ":";
        var inp = "<input type='text' name='Response'>";
        
        var html = "<div>"
                 +    "<span>"+cue+"</span>"
                 +    "<span>"+sep+"</span>"
                 +    "<span>"+tar+"</span>"
                 + "</div>"
                 + "<div>"
                 +    "<span>"+cue+"</span>"
                 +    "<span>"+sep+"</span>"
                 +    "<span>"+inp+"</span>"
                 + "</div>"
                 + "<button type='Submit'>Submit</button>";
        this.container.html(html);
    }
}

var CopyAll = {
    addCSS : function() {
        return ".trial.CopyAll { font-size: 200%; text-align: center; font-family: Arial; } "
             + ".trial.CopyAll div { margin: 15px; } "
             + ".trial.CopyAll span { display: inline-block; width: 48%; } "
             + ".trial.CopyAll span:nth-child(1) { text-align: right; } "
             + ".trial.CopyAll span:nth-child(2) { width: 2%; } "
             + ".trial.CopyAll span:nth-child(3) { text-align: left; } "
             + ".trial.CopyAll input { font-size: 100%; font-family: inherit; margin: -1px; }";
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
                 +     "<span>"+tar+"</span>"
                 +  "</div>"
                 +  "<div>"
                 +     "<span>"+cue+"</span>"
                 +     "<span>"+sep+"</span>"
                 +     "<span>"+inp+"</span>"
                 +  "</div>"
        }
        html += "<button type='Submit'>Submit</button>";
        this.container.html(html);
    }
}

var Instruct = {
    prepareHTML: function() {
        this.container.width(800);
        this.container.css("margin", "0 auto");
        this.container.html(this.inputs["Text"]);
    }
}

var Study = {
    addCSS : function() {
        return ".trial.Study { font-size: 200%; text-align: center; } "
             + ".trial.Study span { display: inline-block; width: 48%; } "
             + ".trial.Study span:nth-child(1) { text-align: right; } "
             + ".trial.Study span:nth-child(2) { width: 2%; } "
             + ".trial.Study span:nth-child(3) { text-align: left; } ";
    },
    
    prepareHTML: function() {
        var cue = this.inputs["Cue"];
        var tar = this.inputs["Target"];
        var sep = ":";
        
        var html = "<div>"
                 +    "<span>"+cue+"</span>"
                 +    "<span>"+sep+"</span>"
                 +    "<span>"+tar+"</span>"
                 + "</div>"
                 + "<button type='Submit'>Submit</button>";
        this.container.html(html);
    }
}

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

var Test = {
    addCSS : function() {
        return ".trial.Test { font-size: 200%; text-align: center; font-family: Arial; } "
             + ".trial.Test div { margin: 15px; } "
             + ".trial.Test span { display: inline-block; width: 48%; } "
             + ".trial.Test span:nth-child(1) { text-align: right; } "
             + ".trial.Test span:nth-child(2) { width: 2%; } "
             + ".trial.Test span:nth-child(3) { text-align: left; } "
             + ".trial.Test input { font-size: 100%; font-family: inherit; margin: -1px; }";
    },
    
    prepareHTML: function() {
        var cue = this.inputs["Cue"];
        var tar = this.inputs["Target"];
        var sep = ":";
        var inp = "<input type='text' name='Response'>";
        
        var html = "<div>"
                 +    "<span>"+cue+"</span>"
                 +    "<span>"+sep+"</span>"
                 +    "<span>"+inp+"</span>"
                 + "</div>"
                 + "<button type='Submit'>Submit</button>";
        this.container.html(html);
    }
}

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

