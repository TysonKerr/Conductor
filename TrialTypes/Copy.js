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
