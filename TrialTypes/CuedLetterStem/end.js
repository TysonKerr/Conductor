    var tar  = this.inputs["Target"];
    var resp = this.recorded["Response"];
    var stemLength;
    stemLength = this.inputs["Stem Length"];
    stemLength = parseInt(stemLength);

    tar  = tar.trim().toLowerCase();
    resp = resp.trim().toLowerCase();

    if (resp === tar || resp === tar.substr(stemLength)) {
        this.recorded["Accuracy"] = 1;
    } else {
        this.recorded["Accuracy"] = 0;
    }
