// global variables//

let count;
let numQuestions = questions.length;
let currentQuestion;
let gameStop = true;
let gameScore;
let timerInterval;
let userAnswers = [];

let time = document.getElementById("timer");
let score = document.getElementById("user-score");

// Start button tied to event listener //
let startBtn = document.getElementById("start");
startBtn.addEventListener("click", newGame);

let welcomeDiv = document.querySelector(".welcome-container");
let questionDiv = document.querySelector(".questions-container");
let formDiv = document.querySelector(".form-container");
let highScoreModal = document.querySelector(".modal-container");
let leaderboard = document.querySelector(".user-scores");

// leaderboard modal tied to event listener //
let leaderLink = document.querySelector(".leaderText");
leaderLink.addEventListener("click", showLeader)

let qTitle = document.getElementById("question-title");
let qChoices = document.getElementById("question-choices");
let username = document.getElementById("username");

let userSubmit = document.getElementById("userSubmit");
userSubmit.addEventListener("click", saveUser);

// Modal Logic
let closeModal = document.querySelector(".close")
closeModal.addEventListener("click", clearModal);
// Close Modal when clicked outside of modal-container
window.addEventListener("click", outsideModal);

let exit = document.querySelector(".exit");
exit.addEventListener("click", clearModal);

let clearScores = document.querySelector(".clear");
clearScores.addEventListener("click", clearLeaderBoard);

function initialize() {

    if (localStorage.length === 0) {
        highScoreArray = [];
        localStorage.setItem("userScores", JSON.stringify(highScoreArray));
    }

    let findTopScore = localStorage.getItem("userScores");
    let parsedScore = JSON.parse(findTopScore);
    console.log(parsedScore);
    let max = 0;
    let user;

    // finding top score via for loop //
    for (let i = 0; i < parsedScore.length; i++) {
        if (max < parsedScore[i].score) {
            max = parsedScore[i].score;
            user = parsedScore[i].username;
        }
    }

    // hiding these elements on game start //

    questionDiv.classList.add("hide");
    formDiv.classList.add("hide");
    highScoreModal.classList.add("hide");

}

//declaring above function to start game

initialize();

function newGame() {
    gameStop = false;
    gameScore = 0;
    currentQuestion = 0;
    userAnswers = [];
    count = 75;
    timer();
    time.textContent = count;
    welcomeDiv.classList.add("hide");
    questionDiv.classList.remove("hide");
    check();
}

// Timer function initializes and starts at 'count' value declared in newGame function above //

function timer() {
    timerInterval = setInterval(function() {
        count--;
        time.textContent = count;
// If count = 0 we run the gameOver function //
        if (count === 0) {
            gameOver();
        }
    }, 1000)
}

function check() {
// Alternate call of gameOver if we reach the end of our question array //
    if (currentQuestion === numQuestions) {
        gameOver();
// If we check and haven't hit the end of the array we keep loading questions // 
    } else {
        loadQuestion();
    }
} 

function loadQuestion() {
    qTitle.textContent = '';
    qChoices.textContent = '';

    for (let i = 0; i < questions[currentQuestion].choices.length; i++) {
        qTitle.textContent = questions[currentQuestion].title;

        let ansChoice = document.createElement("li");
        ansChoice.setAttribute("id", i);
        ansChoice.setAttribute("data-name", `data-choice-${i}`);
        ansChoice.setAttribute("value", questions[currentQuestion].choices[i]);
        ansChoice.classList.add("ans-choice");
        ansChoice.addEventListener("click", next)
        ansChoice.textContent = questions[currentQuestion].choices[i];
        qChoices.appendChild(ansChoice);
    }
}

function next(event) {
    if(event.target.innerText === questions[currentQuestion].answer) {
        gameScore += 10;
    }

    currentQuestion++;
    check();
}

function gameOver() {
    gameStop = true;
    clearInterval(timerInterval);
    time.textContent = "- -";
    gameScore += count;
    questionDiv.classList.add("hide");
    score.textContent = gameScore;
    formDiv.classList.remove("hide");
    username.value = '';
}

function saveUser(event) {
    event.preventDefault();
    if (username.value == '') {
        return;
    }

    let tempArray = localStorage.getItem("userScores");
    let parsedTempArray = JSON.parse(tempArray);
    if (parsedTempArray !== null) {
        parsedTempArray.push(
            {
                username: username.value,
                score: gameScore
            }
        );
        sortScores(parsedTempArray);
        localStorage.setItem('userScores', JSON.stringify(parsedTempArray));
    } else {  
        let highScoreArray = [];
        highScoreArray.push(
            {
                username: username.value,
                score: gameScore
            }
        );
        localStorage.setItem('userScores', JSON.stringify(highScoreArray));
    }
    username.value = '';
    showLeader();
}

function showLeader() {
    formDiv.classList.add("hide");
    questionDiv.classList.add("hide");
    welcomeDiv.classList.add("hide");
    highScoreModal.classList.remove("hide");
    leaderboard.innerHTML = "";
    let highScoreBoard = localStorage.getItem('userScores');
    let parsedScoreBoard = JSON.parse(highScoreBoard);
    for (let i = 0; i < parsedScoreBoard.length; i++) {
        let newScore = document.createElement("li");
        newScore.textContent = parsedScoreBoard[i].username + " : " + parsedScoreBoard[i].score;
        newScore.classList.add("score-item");
        leaderboard.appendChild(newScore);
    }
}

function sortScores(scoreObj) {
    scoreObj.sort( function(a, b) {
        return b.score - a.score;
    });
}

function clearLeaderBoard() {
    localStorage.removeItem("userScores");
    leaderboard.innerHTML = "";
}

function clearModal() {
    highScoreModal.classList.add("hide");
    welcomeDiv.classList.remove("hide");
}

function outsideModal(event) {
    if (event.target == highScoreModal) {
        highScoreModal.classList.add("hide");
        welcomeDiv.classList.remove("hide");
    }
} 
