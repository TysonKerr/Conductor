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
