import { generateQuestion } from "./questions.js";

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

    score = 0;
    scoreElement.textContent = score;

    if(selectedOperator === null) {
        alert("Please select an operator.");
        return;
    }

    currentQuestion = generateQuestion(selectedOperator, selectedDifficulty);

    questionElement.textContent = `${currentQuestion.number1} ${selectedOperator} ${currentQuestion.number2} = ?`
    
    answerInput.value = "";
    feedbackElement.textContent = "";
    
    settings.hidden = true;
    gameContainer.hidden = false;
});

submitButton.addEventListener("click", () => {
    if(currentQuestion === null) {
        return;
    } else if(answerInput.value === "") {
        feedbackElement.textContent = "Please enter answer.";
         return;
     }

     const playerAnswer = Number(answerInput.value);
     
     if(playerAnswer === currentQuestion.answer) {
            feedbackElement.textContent = "Correct answer.";
            score++;
            scoreElement.textContent = score;
     } else {
            feedbackElement.textContent = `Wrong answer. Correct answer is: ${currentQuestion.answer}`;
    }
});
