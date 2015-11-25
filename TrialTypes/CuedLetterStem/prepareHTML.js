    var html       = this.htmlTemplate();
    var stemLength = this.inputs["Stem Length"];
    var tarStem    = this.inputs["Target"].substr(0, stemLength);

    html = fillHtmlTemplate(html, this.inputs);
    html = html.replace('{target stem}', tarStem);

    this.container.html(html);
