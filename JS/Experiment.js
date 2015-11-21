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
    
    this.completed = false;
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
    var delay;
    if (typeof this.inputs.Delay !== "undefined") {
        delay = parseFloat(this.inputs.Delay);
        if (!isFinite(delay)) delay = 0;
    } else {
        delay = 0;
    }
    if (delay > 0) {
        setTimeout(this.showTrial, delay*1000);
    } else {
        this.showTrial();
    }
}

TrialType.prototype.showTrial = function() {
    var focus, duration, thisTrial = this;
    this.container.show().addClass("CurrentTrial");
    this.startTime = Date.now();
    
    if (typeof this.inputs.Duration !== "undefined") {
        duration = parseFloat(this.inputs.Duration);
        if (!isFinite(duration)) duration = -1;
    } else {
        duration = -1;
    }
    if (duration == 0) {
        this.container.submit();
    } else if (duration > 0) {
        setTimeout(function() {
            thisTrial.container.submit();
        }, duration*1000);
    }
    
    // want to focus on first input, except if input type is radio or checkbox
    // only focus on button if its the only button on the screen, and there are no other things to focus on
    focus = this.container.find("input:not([type='button'],[type='radio'],[type='checkbox'])");
    focus.filter(":visible:enabled");
    if (focus.length === 0) {
        focus = this.container.find("input[type='button'], button").filter(":visible:enabled");
        if (focus.length === 1) {
            focus.focus();
        }
    } else {
        focus.first().focus();
    }
    
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
    var resp = this.recorded;
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
    
    this.completed = true;
    
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
    data : null,
    resp : null,
    unsavedResp : [],
    trials : [],
    display : null,
    types : [],
    
    startExp : function() {
        var exp, procLen, newTrial, newContainer, trialData, i, respLen;
        
        exp = this;
        
        $("#LoadingMessage").remove();
        this.display = $("#display");
        
        this.username = window.loginData.u;
        this.loginTime = window.loginData.t;
        
        // load proc and stim data
        this.data = window.expData;
        
        // create trials in Experiment.trials array, also add trial form html to page
        procLen = this.data.Procedure.length;
        for (i=0; i<procLen; ++i) {
            trialData = this.assembleTrialData(this.data.Procedure[i]);
            this.addTrial(trialData);
        }
        
        // load up old responses, mark completed trials as completed
        this.processOldResp();
        for (i=0, respLen=this.resp.length; i<respLen; ++i) {
            if (typeof this.trials[i] === "undefined") {
                // thats weird, we have more responses than trials
                continue;
            }
            this.trials[i].recorded = this.resp[i];
            this.trials[i].completed = true;
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
                    if (head[j].trim().substr(-2) === "[]") {
                        temp[head[j]] = [];
                    } else {
                        temp[head[j]] = "";
                    }
                } else {
                    if (head[j].trim().substr(-2) === "[]") {
                        temp[head[j]] = oldResp[i][j].split('|');
                    } else {
                        temp[head[j]] = oldResp[i][j];
                    }
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
                stimFile = parseInt(col.substr(7)) - 1; // convert "Stimuli 1" to 0, for 0-indexed stim file list
                stimRows = rangeToArray(procRow[col]);  // get the rows pulled from this stim file
                
                stimData = [];
                len = stimRows.length;
                for (i=0; i<len; ++i) {
                    stimData.push(this.data.Stimuli[stimFile][stimRows[i]-2]); // get the data of each row
                }
                
                // convert to array of columns, rows joined by "|"
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
    
    addTrial : function(inputs, index) {
        if (typeof inputs.Type === "undefined") {
            // some error message here
            return;
        }
        
        if (this.types.indexOf(inputs.Type) === -1) {
            this.loadCSS(inputs.Type);
        }
        
        newContainer = $("<form>");
        newContainer.hide();
        
        this.display.append(newContainer);
        
        newTrial = new TrialType(inputs, newContainer);
        newTrial.prepareHTML();
        
        if (index === undefined) {
            this.trials.push(newTrial);
        } else {
            this.trials.splice(index, 0, newTrial);
        }
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
        var trialsLen, i, currentIndex;
        
        // find the trial object which isn't marked as completed yet
        currentIndex = -1;
        trialsLen = this.trials.length;
        for (i=0; i<trialsLen; ++i) {
            if (!this.trials[i].completed) {
                currentIndex = i;
                break;
            }
        }
        
        if (currentIndex === -1) {
            if (this.unsavedResp.length > 0) { // for now, do it after every 2 trials
                this.recordUnsavedResp();
            }
            var doneContainer = $("<div>");
            doneContainer.attr("id", "DoneContainer");
            doneContainer.html("You are all done! Verification code: XXXX-XXXXXXXXXX");
            this.display.append(doneContainer);
        } else {
            this.trials[currentIndex].startTrial();
        }
    },
    
    advanceTrial : function() {
        // add checks to ajax data back to the server
        // ideas: check size of unsaved data, as well as timestamp since last recording
        // if past a certain time, or have enough data, record
        if (this.unsavedResp.length > 1) { // for now, do it after every 2 trials
            this.recordUnsavedResp();
        }
        this.doCurrentTrial();
    },
    
    recordUnsavedResp : function() {
        var responses = [];
        var submit = {};
        var i, j, len, respLen, row;
        var records, rec;
        var trials = this.unsavedResp;
        for (i=0, len=trials.length; i<len; ++i) {
            row = {};
            records = this.trials[trials[i]].recorded;
            for (rec in records) {
                if (rec.trim().substr(-2) === '[]') {
                    row[rec] = records[rec].join('|');
                } else {
                    row[rec] = records[rec];
                }
            }
            responses.push(row);
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
