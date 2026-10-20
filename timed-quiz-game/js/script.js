import { generateQuestion } from "./questions.js";
import { startTimer, stopTimer } from "./timer.js";

const settings  = document.querySelector(".settings")
const operatorButton = document.querySelectorAll(".operator-options button");
const difficulty = document.querySelector("#difficulty");
const startButton = document.querySelector("#startButton");
const gameContainer = document.querySelector("#gameContainer");
const questionElement = document.querySelector("#question");
const scoreElement = document.querySelector("#score");
const submitButton = document.querySelector("#submitButton");
const answerInput = document.querySelector("#answerInput");
const feedbackElement = document.querySelector("#feedback");
const timerElement = document.querySelector("#timer");
const playAgainButton = document.querySelector("#playAgainButton");
const nextQuestionButton = document.querySelector("#nextQuestionButton");

let selectedOperator = null;
let selectedDifficulty = "easy";
let currentQuestion = null;
let score = 0;

function updateTimerDisplay(time) {
    timerElement.textContent = time;
}

function handleTimeUp() {
    feedbackElement.textContent = `Times up! The correct answer is: ${currentQuestion.answer}`;

    submitButton.disabled = true;
    answerInput.disabled = true;

    playAgainButton.hidden = false;
    nextQuestionButton.hidden = false;
}

operatorButton.forEach((button) => {

    button.addEventListener("click", () => {
        selectedOperator = button.dataset.operator;
    });
});

difficulty.addEventListener("change", () => {
    selectedDifficulty = difficulty.value;
});

/////////////////////////////////////////////
startButton.addEventListener("click", () => {

    if(selectedOperator === null) {
        alert("Please select an operator.");
        return;
    }

    score = 0;
    scoreElement.textContent = score;
    playAgainButton.hidden = true;
    nextQuestionButton.hidden = true;

    currentQuestion = generateQuestion(selectedOperator, selectedDifficulty);

    startTimer(10, updateTimerDisplay, handleTimeUp);

    questionElement.textContent = `${currentQuestion.number1} ${selectedOperator} ${currentQuestion.number2} = ?`
    
    answerInput.value = "";
    feedbackElement.textContent = "";
    
    settings.hidden = true;
    gameContainer.hidden = false;

submitButton.disabled = false;
answerInput.disabled = false;
});

submitButton.addEventListener("click", () => {
    if(currentQuestion === null) {
        return;
    } else if(answerInput.value === "") {
        feedbackElement.textContent = "Please enter answer.";
         return;
     }
     stopTimer();

     submitButton.disabled = true;
     answerInput.disabled = true;

     const playerAnswer = Number(answerInput.value);
     
     if(playerAnswer === currentQuestion.answer) {
            feedbackElement.textContent = "Correct answer.";
            score++;
            scoreElement.textContent = score;
     } else {
            feedbackElement.textContent = `Wrong answer. Correct answer is: ${currentQuestion.answer}`;
    }

    playAgainButton.hidden = false;
    nextQuestionButton.hidden = false;
});

playAgainButton.addEventListener("click", () => {
    settings.hidden = false;
    gameContainer.hidden = true;
});

nextQuestionButton.addEventListener("click", () => {
    currentQuestion = generateQuestion(selectedOperator, selectedDifficulty);
    questionElement.textContent = `${currentQuestion.number1} ${selectedOperator} ${currentQuestion.number2} = ?`;

    answerInput.value = "";
    feedbackElement.textContent = "";

    submitButton.disabled = false;
    answerInput.disabled = false;
    playAgainButton.hidden = true;

    startTimer(10, updateTimerDisplay, handleTimeUp);

    nextQuestionButton.hidden = true;
});