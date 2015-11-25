window['trialTypes']['Likert'] = {
    style: function() {
        var me = ".trial.Likert ";
        var tbl = me+".LikertTable ";
        return me+"{ width: 100%; max-width: 600px; margin: auto; } "
             + me+"input[type='radio'] { display: none; } "
             + me+".LikertQuestion { font-size: 150%; } "
             
             + me+".LikertDescript { color: #666; } "
             + me+".LikertDescript div { display: inline-block; } "
             + me+".LikertLeft { width: 50%; text-align: left; } "
             + me+".LikertRight { width: 50%; text-align: right; } "
             
             + tbl+"{ width: 100%; display: table; margin: 5px auto 10px; } "
             + tbl+"> div { width: 100%; display: table-row; } "
             + tbl+"> div > label { display: table-cell; vertical-align: middle; text-align: center; } "
             + tbl+"span { border: 2px solid #FFF; padding: 4px 8px; border-radius: 25px; display: inline-block; } "
             + tbl+"input:checked + span { border-color: green; } "
             + tbl+"label:hover span { border-color: #0F0; }";
    },
    
    htmlTemplate: function() {
        return "<div class='LikertQuestion'>{Question}</div>"
             + "<div class='LikertDescript'>"
             +     "<div class='LikertLeft'>{LeftDesc}</div>"
             +     "<div class='LikertRight'>{RightDesc}</div>"
             + "</div>"
             + "<div class='LikertTable'><div>"
             + "{LikertScale}"
             + "</div></div>"
             + "<button type='Submit'>Submit</button>";
    },
    
    prepareHTML: function() {
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
    }
}
