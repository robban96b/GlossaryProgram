/* This file includes functions used for setting up and ending program but also modifying html elements */

// updates boxes containing last word, your guess and the correct ans, needs to be called in updateGlossary()
function displayLastGlossary() {
    document.getElementById("yourAns").value = document.getElementById("userInput").value;
    document.getElementById("correntAns").value = word1;
    document.getElementById("wordToTranslate").value = word2 + " (" + informationAboutTranslation + ")";
}


// function to update color and message in statusBox
function updateStatusBox(message, color) {
    document.getElementById("statusBox").innerHTML = message;
    document.getElementById("statusBox").style.background = color;
}

// displays result from last runthrough of all words
function displayOverallResult() {
    if (amountInRowSystem) {
        document.getElementById("result").innerHTML = "Words left: " + Math.max(list2.length, list1.length);
    } else {
        document.getElementById("result").innerHTML = "Result: " + overallCorrectWords + "/" + data.length;
    }
    overallCorrectWords = 0;

    // fades in and the fades out color of result background color
    var ofs = 0;
    var interval = window.setInterval(function () {
        ofs += 0.05;
        document.getElementById("result").style.backgroundColor = "rgba(0, 255, 0, " + Math.abs(Math.sin(ofs)); + ")";
        if (ofs > 3 * Math.PI) {
            clearInterval(interval);
        }
    }, 10);

}


// setups the program, calls getNewGlossary and setups the key ENTER
function start() {
    if (amountInRowSystem) {
        for (let i = 0; i < data.length; i++) {
            list1[i].push(0);
        }
    }
    getNewGlossary();

    document.getElementById("userInput").onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            checkTranslate();
            return false;
        }
    }
    document.getElementById("glossaryInformation").onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            checkTranslate();
            return false;
        }
    }
}

function tearDown() {
    document.getElementById("userInput").value = "";
    document.getElementById("glossaryInformation").value = "Finished";
    document.getElementById("key").innerHTML = "<b> No more words </b>";

    document.getElementById("userInput").onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            return false;
        }
    }
    document.getElementById("glossaryInformation").onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            return false;
        }
    }
}