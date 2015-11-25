    var scale, texts;
    var question, leftDesc, rightDesc, likert;
    var i, len, inpStart, inpMid, inpEnd;
    var html;

    texts = this.inputs["Text"].split('|');
    scale = this.inputs["Settings"];
    scale = rangeToArray(scale);

    question = texts.shift();

    if (texts.length === 0) {
        texts = ['',''];
    } else if (texts.length === 1) {
        texts.push('');
    }

    leftDesc  = texts[0];
    rightDesc = texts[1];

    likert = "";

    inpStart = "<label><input type='radio' name='Response' value='";
    inpMid   = "'><span>";
    inpEnd   = "</span></label>";

    for (i=0, len=scale.length; i<len; ++i) {
        likert += inpStart+scale[i]+inpMid+scale[i]+inpEnd;
    }

    html = this.htmlTemplate();
    html = html.replace("{Question}",    question);
    html = html.replace("{LeftDesc}",    leftDesc);
    html = html.replace("{RightDesc}",   rightDesc);
    html = html.replace("{LikertScale}", likert);

    this.container.html(html);
