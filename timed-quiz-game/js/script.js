import { generateQuestion } from "./questions.js";
import { startTimer, stopTimer } from "./timer.js";
////////////////////////////

const timerElement = document.querySelector("#timer");
//////////////////////////////

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

let selectedOperator = null;
let selectedDifficulty = "easy";
let currentQuestion = null;
let score = 0;

operatorButton.forEach((button) => {

    button.addEventListener("click", () => {
        selectedOperator = button.dataset.operator;
    });
});

difficulty.addEventListener("change", () => {
    selectedDifficulty = difficulty.value;
});

startButton.addEventListener("click", () => {

    if(selectedOperator === null) {
        alert("Please select an operator.");
        return;
    }

    score = 0;
    scoreElement.textContent = score;

    currentQuestion = generateQuestion(selectedOperator, selectedDifficulty);

    questionElement.textContent = `${currentQuestion.number1} ${selectedOperator} ${currentQuestion.number2} = ?`
    
    answerInput.value = "";
    feedbackElement.textContent = "";
    
    settings.hidden = true;
    gameContainer.hidden = false;

    const timeLimit = {
    easy: 15,
    medium: 10,
    hard: 5
};

startTimer(
    timeLimit[selectedDifficulty],
    (remainingTime) => {
        timerElement.textContent = remainingTime;
    },
    () => {
        feedbackElement.textContent = "Time's up!";
        submitButton.disabled = true;
        answerInput.disabled = true;
    }
);

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

     const playerAnswer = Number(answerInput.value);
     
     if(playerAnswer === currentQuestion.answer) {
            feedbackElement.textContent = "Correct answer.";
            score++;
            scoreElement.textContent = score;
     } else {
            feedbackElement.textContent = `Wrong answer. Correct answer is: ${currentQuestion.answer}`;
    }
});
