// ===== Display Date =====
date.textContent = time();

function time() {
    let d = new Date();
    // Concatenate the date
    let str = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    return str;
}

// ===== Global Variables =====
let score, answer, level;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

const playBtn = document.getElementById("playBtn");
const guessBtn = document.getElementById("guessBtn");
const giveUpBtn = document.getElementById("giveUp");
const guessInput = document.getElementById("guess");
const msg = document.getElementById("msg");

// ===== Event Listeners =====
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

// ===== Functions =====
function play() {
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guessInput.disabled = false;
    giveUpBtn.disabled = false;

    // Disable level buttons
    for (let i = 0; i < levelArr.length; i++) {
        levelArr[i].disabled = true;
        if (levelArr[i].checked) {
            level = levelArr[i].value;
        }
    }

    // Generate random answer
    answer = Math.floor(Math.random() * level) + 1;
    msg.textContent = "Guess a number between 1 and " + level;
    guessInput.value = "";
    score = 0;
}

function makeGuess() {
    let userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > level) {
        msg.textContent = "❌ Invalid input! Enter a number between 1 and " + level + ".";
        return;
    }

    score++;

    if (userGuess < answer) {
        msg.textContent = "Too low! Try again.";
    } else if (userGuess > answer) {
        msg.textContent = "Too high! Try again.";
    } else {
        msg.textContent = "🎉 Correct! You guessed it in " + score + " tries.";
        updateScore();
        reset();
    }
}

function giveUp() {
    msg.textContent = "The correct answer was " + answer + ". Better luck next time!";
    reset();
}

function reset() {
    guessBtn.disabled = true;
    guessInput.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;

    for (let i = 0; i < levelArr.length; i++) {
        levelArr[i].disabled = false;
    }
}

function updateScore() {
    scoreArr.push(score);
    wins.textContent = "Total Wins: " + scoreArr.length;

    // Sort ascending
    scoreArr.sort((a, b) => a - b);

    // Update leaderboard
    const lb = document.getElementsByName("leaderboard");
    for (let i = 0; i < lb.length; i++) {
        lb[i].textContent = scoreArr[i] ? scoreArr[i] : "--";
    }

    // Average score
    let sum = scoreArr.reduce((a, b) => a + b, 0);
    let avg = sum / scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}
 
