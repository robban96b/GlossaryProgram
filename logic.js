// if true glossaries are removed (for current runthrough, not from data.js) after they've been correct a certain amount of times
// if false, no glossaries will be removed
var amountInRowSystem = true;
var individualWordCorrectStreak = 3;

// 0: user writes word from left column and gets right word shown
// 1: user writes word from right column and gets left word shown
// 2: user writes both from left and right collumn of data, random which order
var wordToWrite = 1;

var list1 = data.slice();
var list2 = [];
var word1 = "";
var word2 = "";
var triesLeft = 1;
var userInp = "";
var overallCorrectWords = 0;
var informationAboutTranslation = "";

// returns a random number between zero (incl) and dataLength (excl)
function getRandomIndex() {
    return Math.floor(Math.random() * list1.length);
}


// returns a binary
function getBin() {
    var binary;
    switch (wordToWrite) {
        case 0:
            binary = 0;
            break;
        case 1:
            binary = 1;
            break;
        default:
            binary = Math.round(Math.random());
            break;
    }
    return binary;
}


// refills list1 if empty and ends program if no more words to refill (amountInRowSystem = true)
// returns false if refill was needed but no more glossaries were left, else returns true
function refillListIfNecessary() {
    // list1 empty, bring back words from list2
    if (list1.length == 0) {
        displayOverallResult();
        list1 = list2.slice();
        list2 = [];
    }
    if (list1.length == 0 && list2.length == 0 && amountInRowSystem) { // no more words left
        tearDown();
        return false;
    }
    return true;
}


// sets up a new vocable (single glossary/glosa) from list1 and moves to the front of list2
function getNewGlossary() {
    var listIndex = getRandomIndex();
    var binary = getBin();
    triesLeft = 1;
    displayLastGlossary();
    var wordsLeft = refillListIfNecessary();
    if (!wordsLeft) { return; }

    word1 = list1[listIndex][binary];
    word2 = list1[listIndex][1 - binary];
    informationAboutTranslation = list1[listIndex][2];

    list2.unshift(list1[listIndex]);
    list1.splice(listIndex, 1);

    //prints out words left for current runthrough in log
    console.log(JSON.stringify(list1.length));

    document.getElementById("userInput").value = "";
    document.getElementById("glossaryInformation").value = informationAboutTranslation;
    document.getElementById("key").innerHTML = "<b>" + word2 + "</b>";
}


// checks that the user input is correct or incorrect and updates statusbox and glossary accordingly
function checkTranslate() {
    userInp = document.getElementById("userInput").value;
    if (userInp == word1) {                      // glossary is correct
        overallCorrectWords++;
        updateStatusBox("Correct", "Lime");
        list2[0][3]++;                    // increase amount of times a guess been right without failure
        if (list2[0][3] == individualWordCorrectStreak && amountInRowSystem) {    //removes word if it been guessed currect a certain amount of times
            list2.shift();
        }
        getNewGlossary();
    } else {
        triesLeft--;
        if (triesLeft < 0) {                    // no more tries left
            updateStatusBox("Wrong, new word", "Red");
            list2[0][3] = 0;                    // resets amount of times a guess been right without failure
            getNewGlossary();
        } else {                                // one last try
            updateStatusBox("Wrong, try again", "Red");
        }
    }
}