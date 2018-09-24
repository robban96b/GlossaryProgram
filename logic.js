var threeInRowSystem = true;
var individualWordCorrectStreak = 3;
var list1 = data.slice();
for (let i = 0; i < data.length; i++) {
    list1[i].push(0);
}
var list2 = [];
var word1 = "";
var word2 = "";
var triesLeft = 1;
var userInp = "";
var correctWords = 0;
var informationAboutTranslation = "";

// returns a random number between zero (incl) and dataLength (excl)
function getRandomIndex() {
    return Math.floor(Math.random() * list1.length);
}

// returns a random binary
function getRandomBin() {
    return Math.round(Math.random());
}

// picks a random new touple from list1 in a random order, stores them in word1, word2 and list2 followed by removing themfrom list1
function setupNewWord() {
    var listIndex = getRandomIndex();
    var randBin = getRandomBin(); 

    // De två följande raderna (rad 27 och 28) beskriver från vilken kolumn användaren skall skriva, för att välja en rad tar
    // du bort de två första snedsträcken // och för att inte välja en rad (typ ta bort) lägger du till två snesträck i början.
    // Om båda raderna börjar med två snedsträck kommer det att slumpas på vilket språk du skall översätta från/till.
    randBin = 0 // användaren skriver vänstra ordet och får högra ordet visat
    //randBin = 1 // användaren skriver högra ordet och får vänstra ordet visat

    word1 = list1[listIndex][randBin];
    word2 = list1[listIndex][1 - randBin];
    informationAboutTranslation = list1[listIndex][2]; // adding translation information
    
    list2.unshift(list1[listIndex]);
    list1.splice(listIndex, 1);
    
    document.getElementById("userInput").value = "";
    document.getElementById("gender").value = informationAboutTranslation;
    document.getElementById("key").innerHTML = "<b>" + word2 + "</b>";
}

// setups the program, removes an element from list1 for first glossary and setups the key ENTER
function start() {
    setupNewWord();
    
    document.getElementById("userInput").onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            checkTranslate();
            return false;
        }
    }
    document.getElementById("gender").onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter pressed
            checkTranslate();
            return false;
        }
    }
}

// displays result from last runthrough of all words
function displayResult() {
    if (threeInRowSystem) {
        document.getElementById("result").innerHTML = "Words left: " + Math.max(list2.length, list1.length);
    } else {
        document.getElementById("result").innerHTML = "Result: " + correctWords + "/" + data.length;
    }
    correctWords = 0;

    // fades in and the fades out color of result background color
    var ofs = 0;
    var interval = window.setInterval(function() {
        ofs += 0.05;
        document.getElementById("result").style.backgroundColor = "rgba(0, 255, 0, " + Math.abs(Math.sin(ofs)); + ")";
        if(ofs > 3 * Math.PI) {
            clearInterval(interval);
        }
    }, 10);
    
}

// gets a new glossary from list1, if last one then move elements back from list2
function updateGlossary() {
    triesLeft = 1;
    displayLastWord();
    
    if (list1.length == 0) {
        displayResult();
        list1 = list2.slice();
        list2 = [];
    }
    setupNewWord();
}

// updates boxes containing last word, your guess and the correct ans, needs to be called in updateGlossary()
function displayLastWord() {
    document.getElementById("yourAns").value = userInp;
    document.getElementById("correntAns").value = word1;
    document.getElementById("wordToTranslate").value = word2 + " (" + informationAboutTranslation + ")";
}


// function to update color and message in statusBox
function updateStatusBox(message, color) {
    document.getElementById("statusBox").innerHTML = message;
    document.getElementById("statusBox").style.background = color;
}

// checks that the user input is correct or incorrect and updates statusbox and glossary accordingly
function checkTranslate() {
    userInp = document.getElementById("userInput").value;
    if (userInp == word1) {                      // glossary is correct
        correctWords++;
        updateStatusBox("Correct", "Lime");
        list2[0][3]++;                    // increase amount of times a guess been right without failure
        if(list2[0][3] == individualWordCorrectStreak) {    //removes word if it been guessed currect a certain amount of times
            list2.shift();
        }
        updateGlossary();
    } else {
        triesLeft--;
        if (triesLeft < 0) {                    // no more tries left
            updateStatusBox("Wrong, new word", "Red");
            list2[0][3] = 0;                    // resets amount of times a guess been right without failure
            updateGlossary();
        } else {                                // one last try
            updateStatusBox("Wrong, try again", "Red");
        }
    }
}

