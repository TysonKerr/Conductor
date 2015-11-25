    var tar = this.inputs["Target"];
    var resp = this.recorded["Response"];

    if (tar.trim().toLowerCase() === resp.trim().toLowerCase()) {
        this.recorded["Accuracy"] = 1;
    } else {
        this.recorded["Accuracy"] = 0;
    }
