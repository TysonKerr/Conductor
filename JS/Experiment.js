if (typeof jQuery === "undefined") {
    document.write("<script src='JS/jquery-1.11.3.min.js'><\/script>");
}

/* * * * * * * * * * * * * * * * *
 * TRIAL TYPE
 * * * * */
function TrialType(inputs, container) {
    var thisTrial = this;
    var thisType;
    
    this.inputs = inputs;
    this.container = container;
    this.recorded = {};
    
    thisType = this.inputs.Type;
    
    this.type = window[thisType];
    for (prop in this.type) {
        // skip reserved method names
        if (prop === "init")       continue;
        if (prop === "fin")        continue;
        if (prop === "startTrial") continue;
        if (prop === "showTrial")  continue;
        
        this[prop] = this.type[prop];
    }
    
    this.container.addClass("trial");
    this.container.addClass(inputs.Type);
    
    this.container.attr("autocomplete", "off");
    
    this.prepareHTML();
    
    this.container.on("submit", function(e) {
        thisTrial.handleSubmit(e);
    });
}

TrialType.prototype.prepareHTML = function() {
    // this should be overridden by the specific trial type
    this.container.width(800);
    this.container.css("margin", "0 auto");
    this.container.html(
        "<p>Welcome to the Conductor! To make a new trial type, "
       +"make a file in the JS folder of this program, and have "
       +"this file create an object with a prepareHTML method to "
       +"define the HTML of this trial type. For example:</p> <pre>"
       +"var newTrialType = {\n"
       +"    prepareHTML : function() {\n"
       +"        this.container.html(\n"
       +"            \"Hello there! This will show up to participants!\"\n"
       +"        );\n"
       +"    }\n"
       +"}</pre>\n"
       +"<button type='submit'>Click here to proceed</button>"
    );
    var pre = this.container.find("pre");
    pre.css("text-align", "left");
    pre.css("border", "2px solid #CCC");
    pre.css("background-color", "#EEE");
    pre.css("padding", "2px");
}

TrialType.prototype.startTrial = function() {
    if (typeof this.Delay !== "undefined" && this.Delay > 0) {
        setTimeout(this.showTrial, this.Delay*1000);
    } else {
        this.showTrial();
    }
}

TrialType.prototype.showTrial = function() {
    this.container.show().addClass("CurrentTrial");
    this.startTime = Date.now();
    
    if (typeof this.Duration !== "undefined" && this.Duration > 0) {
        setTimeout(function() {
            this.container.submit();
        }, this.Duration*1000);
    }
    
    this.container.find(":input:not(:radio,:checkbox,button,[type='button']), :submit").filter(":visible:enabled").first().focus();
    
    this.start();
}

TrialType.prototype.start = function() {
    // nothing extra, this is just a placeholder to be overridden
}

TrialType.prototype.handleSubmit = function(e) {
    e.preventDefault();
    this.fin();
}

TrialType.prototype.fin = function() {
    var resp = {};
    resp["Trial Duration"] = Date.now() - this.startTime;
    resp["Show Time"] = this.startTime;
    resp["Raw Input"] = this.container.serialize();
    var respArray = this.container.serializeArray();
    var len = respArray.length;
    var name, nameTrim, val;
    for (var i=0; i<len; ++i) {
        name = respArray[i].name
        nameTrim = name.trim();
        if (nameTrim.substr(-2) === '[]') {
            if (typeof resp[name] === "undefined") resp[name] = [];
            resp[name].push(respArray[i].value);
        } else {
            resp[name] = respArray[i].value;
        }
    }
    
    var thisIndex = $(".trial").index(this.container);
    resp.Trial = thisIndex;
    Experiment.resp[thisIndex] = resp;
    Experiment.unsavedResp.push(thisIndex);
    
    this.end();
    
    this.container.removeClass("CurrentTrial").hide();
    
    Experiment.advanceTrial();
}

TrialType.prototype.end = function() {
    // nothing extra, this is just a placeholder to be overridden
}

/* * * * * * * * * * * * * * * * *
 * EXPERIMENT
 * * * * */
var Experiment = {
    username : null,
    loginTime : null,
    current : null,
    data : null,
    resp : null,
    unsavedResp : [],
    trials : [],
    display : null,
    types : [],
    
    
    startExp : function() {
        var exp, procLen, newTrial, newContainer, trialData;
        
        exp = this;
        
        $("#LoadingMessage").remove();
        this.display = $("#display");
        
        this.username = window.loginData.u;
        this.loginTime = window.loginData.t;
        
        this.data = window.expData;
        this.processOldResp();
        
        this.current = this.resp.length;
        
        procLen = this.data.Procedure.length;
        
        for (var i=0; i<procLen; ++i) {
            trialData = this.assembleTrialData(this.data.Procedure[i]);
            this.addTrial(trialData);
        }
        
        this.doCurrentTrial();
    },
    
    processOldResp : function() {
        var oldResp = window.resp;
        if (oldResp.length < 2) {
            this.resp = [];
            return;
        }
        
        var head = oldResp[0];
        var i, len;
        var j, hLen;
        var resp = [];
        var temp;
        for (i=1, len=oldResp.length; i<len; ++i) {
            temp = {};
            for (j=0, hLen = head.length; j<hLen; ++j) {
                if (typeof oldResp[i][j] === "undefined") {
                    temp[head[j]] = "";
                } else {
                    temp[head[j]] = oldResp[i][j];
                }
            }
            resp.push(temp);
        }
        this.resp = resp;
    },
    
    assembleTrialData : function(procRow) {
        var output, col, stimFile, stimRows, stimData, i, len, stimByCol, stimCol;
        
        output = {};
        
        for (col in procRow) {
            output[col] = procRow[col];
            if (col.substr(0, 7) === "Stimuli") {
                stimFile = parseInt(col.substr(7)) - 1;
                stimRows = rangeToArray(procRow[col]);
                
                stimData = [];
                len = stimRows.length;
                for (i=0; i<len; ++i) {
                    stimData.push(this.data.Stimuli[stimFile][stimRows[i]-2]);
                }
                
                stimByCol = {};
                for (stimCol in stimData[0]) {
                    stimByCol[stimCol] = [];
                    for (i=0; i<len; ++i) {
                        stimByCol[stimCol].push(stimData[i][stimCol]);
                    }
                    output[stimCol] = stimByCol[stimCol].join('|');
                }
            }
        }
        
        return output;
    },
    
    addTrial : function(inputs) {
        if (typeof inputs.Type === "undefined") {
            // some error message here
            return;
        }
        
        if (this.types.indexOf(inputs.Type) === -1) {
            this.loadCSS(inputs.Type);
        }
        
        newContainer = $("<form>");
        newContainer.attr("id", "trial"+this.trials.length);
        newContainer.hide();
        
        this.display.append(newContainer);
        
        newTrial = new TrialType(inputs, newContainer);
        newTrial.prepareHTML();
        
        this.trials.push(newTrial);
    },
    
    loadCSS(type) {
        this.types.push(type);
        if (typeof window[type] === "undefined") {
            // type doesn't exist... problem
            return;
        }
        if (typeof window[type].addCSS === "function") {
            var css = $("<style>");
            css.html(window[type].addCSS());
            $("head").append(css);
        }
    },
    
    doCurrentTrial : function() {
        var procLen = this.data.Procedure.length;
        
        if (this.current >= procLen) {
            var doneContainer = $("<div>");
            doneContainer.attr("id", "DoneContainer");
            doneContainer.html("You are all done! Verification code: XXXX-XXXXXXXXXX");
            this.display.append(doneContainer);
        } else {
            this.trials[this.current].startTrial();
        }
    },
    
    advanceTrial : function() {
        // add checks to ajax data back to the server
        // ideas: check size of unsaved data, as well as timestamp since last recording
        // if past a certain time, or have enough data, record
        if (this.unsavedResp.length > 1) { // for now, do it after every 2 trials
            this.recordUnsavedResp();
        }
        ++this.current;
        this.doCurrentTrial();
    },
    
    recordUnsavedResp : function() {
        var responses = [];
        var submit = {};
        var i, len;
        var trial, trialData;
        var trials = this.unsavedResp;
        for (i=0, len=trials.length; i<len; ++i) {
            responses.push(this.resp[trials[i]]);
        }
        this.unsavedResp = []; // so we dont try to save this data again while we wait for the ajax to go through
        submit.u = this.username;
        submit.t = this.loginTime;
        submit.r = JSON.stringify(responses);
        $.ajax({
            type: "POST",
            url: location.href,
            data: submit,
            trials: trials,
            exp: this,
            success: Experiment.markRecorded,
            
        });
    },
    
    markRecorded() {
        // note that since this is called from $.ajax, "this" refers to the ajax call, not the Experiment object
        // use this.exp to get the Experiment that made this call
        var trials = this.trials;
        var i, len;
        for (i=0, len=trials.length; i<len; ++i) {
            $("#trial"+trials[i]).addClass("Recorded");
        }
    }
}

window.addEventListener("load", function() {
    Experiment.startExp();
});

function rangeToArray(string, sep, con) {
    var output, ranges, len, i, range, start, end, count, step, j;
    
    sep = sep || ",";
    con = con || "::";
    
    if (typeof string !== "string") string = string.toString();
    if (typeof sep !== "string") sep = sep.toString();
    if (typeof con !== "string") con = con.toString();
    
    output = [];
    ranges = string.split(sep);
    len = ranges.length;
    for (i=0; i<len; ++i) {
        range = ranges[i].split(con);
        if (range.length === 1) {
            if (range[0] !== '') output.push(range[0]);
        } else {
            start = parseInt(range[0]);
            end   = parseInt(range[range.length-1]);
            if (start > end) {
                step = -1;
                count = start - end;
            } else {
                step = 1;
                count = end - start;
            }
            for (j=0; j<=count; ++j) {
                output.push(start+step*j);
            }
        }
    }
    
    return output;
}
