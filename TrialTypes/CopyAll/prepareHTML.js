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
