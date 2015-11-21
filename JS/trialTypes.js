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
    },
    
    end : function() {
        var tar = this.inputs["Target"];
        var resp = this.recorded["Response"];
        if (tar.trim().toLowerCase() === resp.trim().toLowerCase()) {
            this.recorded["Accuracy"] = 1;
        } else {
            this.recorded["Accuracy"] = 0;
        }
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

var Likert = {
    addCSS : function() {
        var me = ".trial.Likert ";
        var tbl = me+".LikertTable ";
        return me+"{ width: 100%; max-width: 600px; margin: auto; } "
             + me+".LikertQuestion { font-size 150%; } "
             + me+".LikertDescript { color: #666; } "
             + me+".LikertDescript div { display: inline-block; } "
             + me+".LikertLeft { width: 50%; text-align: left; } "
             + me+".LikertRight { width: 50%; text-align: right; } "
             + tbl+"{ width: 100%; display: table; } "
             + tbl+"> div { width: 100%; display: table-row; } "
             + tbl+"> div > label { display: table-cell; vertical-align: middle; text-align: center; } "
             + me+"input[type='radio'] { display: none; } "
             + tbl+"span { border: 2px solid #FFF; padding: 4px 8px; border-radius: 25px; } "
             + tbl+"input:checked + span { border-color: green; } "
             + tbl+"label:hover span { border-color: #0F0; }";
    },
    
    prepareHTML: function() {
        var texts, questions, scale, html, inpStart, inpMid, inpEnd, i, len;
        
        texts = this.inputs["Text"].split('|');
        question = texts.shift();
        
        if (texts.length === 0) {
            texts = ['',''];
        } else if (texts.length === 1) {
            texts.push('');
        }
        
        scale = this.inputs["Settings"];
        scale = rangeToArray(scale);
        
        html = "<div class='LikertQuestion'>"+question+"</div>"
             + "<div class='LikertDescript'>"
             +     "<div class='LikertLeft'>" +texts[0]+"</div>"
             +     "<div class='LikertRight'>"+texts[1]+"</div>"
             + "</div>"
             + "<div class='LikertTable'><div>";
        inpStart = "<label><input type='radio' name='Response' value='";
        inpMid   = "'><span>";
        inpEnd   = "</span></label>";
        for (i=0, len=scale.length; i<len; ++i) {
            html += inpStart+scale[i]+inpMid+scale[i]+inpEnd;
        }
        html += "</div></div>"
             +  "<button type='Submit'>Submit</button>";
        
        this.container.html(html);
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
    
    prepareHTML : function() {
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
    },
    
    end : function() {
        var tar = this.inputs["Target"];
        var resp = this.recorded["Response"];
        if (tar.trim().toLowerCase() === resp.trim().toLowerCase()) {
            this.recorded["Accuracy"] = 1;
        } else {
            this.recorded["Accuracy"] = 0;
        }
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

