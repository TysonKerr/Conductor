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
