// ===== Display Date and Live Time =====
function updateDateTime() {
    const d = new Date();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const monthName = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    // Add date suffix
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                   (day % 10 === 2 && day !== 12) ? "nd" :
                   (day % 10 === 3 && day !== 13) ? "rd" : "th";

    // Format time with leading zeros
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    date.textContent = `${monthName} ${day}${suffix}, ${year} - ${hours}:${minutes}:${seconds}`;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime();

// ===== Global Variables =====
let score, answer, level, playerName;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
let startTime, endTime;
let totalTime = 0;
let fastestTime = Infinity;

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
function askName() {
    playerName = prompt("Please enter your name:");
    while (!playerName || playerName.trim() === "") {
        playerName = prompt("You must enter a name to play:");
    }

    // Capitalize correctly
    playerName = playerName.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function play() {
    if (!playerName) askName();

    playBtn.disabled = true;
    guessBtn.disabled = false;
    guessInput.disabled = false;
    giveUpBtn.disabled = false;

    for (let i = 0; i < levelArr.length; i++) {
        levelArr[i].disabled = true;
        if (levelArr[i].checked) {
            level = levelArr[i].value;
        }
    }

    answer = Math.floor(Math.random() * level) + 1;
    msg.textContent = `${playerName}, guess a number between 1 and ${level}`;
    guessInput.value = "";
    score = 0;

    // Start round timer
    startTime = new Date().getTime();
}

function makeGuess() {
    let userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > level) {
        msg.textContent = `❌ Invalid input, ${playerName}! Enter a number between 1 and ${level}.`;
        return;
    }

    score++;
    let diff = Math.abs(userGuess - answer);

    // Temperature feedback
    if (diff >= level / 2) {
    msg.textContent = "❄️ Cold! Try again.";
    flashBackground("rgb(100, 180, 255)"); // blue
} else if (diff >= level / 4) {
    msg.textContent = "🌡️ Warm! Getting closer.";
    flashBackground("rgb(255, 180, 80)"); // orange
} else if (diff > 0) {
    msg.textContent = "🔥 Hot! You're very close!";
    flashBackground("rgb(255, 80, 80)"); // red
}

    if (userGuess === answer) {
        endTime = new Date().getTime();
        const roundTime = ((endTime - startTime) / 1000).toFixed(2);
        totalTime += parseFloat(roundTime);

        // Update fastest time
        if (roundTime < fastestTime) fastestTime = roundTime;

        // Performance feedback
        let performance;
        if (score <= 3) performance = "Excellent! ";
        else if (score <= 6) performance = "Pretty good! ";
        else performance = "You can do better next time! ";

        msg.textContent = `🎉 Correct, ${playerName}! You guessed it in ${score} tries and ${roundTime}s. ${performance}`;

        launchConfetti(); 

        flashBackground("rgb(80, 255, 120)"); // green flash for correct guess


        updateScore(roundTime);
        reset();
    }
}

function giveUp() {
    // When user gives up, set score to range value
    score = parseInt(level);
    msg.textContent = `You gave up, ${playerName}. The correct number was ${answer}. Score set to ${score}.`;
    endTime = new Date().getTime();

    const roundTime = ((endTime - startTime) / 1000).toFixed(2);
    totalTime += parseFloat(roundTime);

    updateScore(roundTime);
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

function updateScore(roundTime) {
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

    // Average time per game
    const avgTime = (totalTime / scoreArr.length).toFixed(2);
    if (!document.getElementById("timeStats")) {
        const timeStats = document.createElement("p");
        timeStats.id = "timeStats";
        document.body.appendChild(timeStats);
    }
    document.getElementById("timeStats").textContent =
        `⏱️ Fastest Time: ${fastestTime === Infinity ? "N/A" : fastestTime + "s"} | Avg Time: ${avgTime}s`;
}

// ====== Bonus Feature: Confetti Celebration ======
function launchConfetti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        // create bursts of confetti
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}  

// ====== Bonus Feature: Background Flash Effect ======
function flashBackground(color) {
    const body = document.body;
    const original = window.getComputedStyle(body).backgroundColor;

    // Change background instantly
    body.style.transition = "background-color 0.3s ease";
    body.style.backgroundColor = color;

    // Fade back to normal after a moment
    setTimeout(() => {
        body.style.backgroundColor = original;
    }, 700);
}


