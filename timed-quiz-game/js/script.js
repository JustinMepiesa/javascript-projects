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
const numberOfQuestions = document.querySelector("#numberOfQuestions");
const resultContainer = document.querySelector("#resultContainer");
const finalScoreElement = document.querySelector("#finalScore");

let selectedOperator = null;
let selectedDifficulty = "easy";
let currentQuestion = null;
let score = 0;
let currentQuestionNumber = 1;
const totalQuestions = 10;

const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function updateTimerDisplay(time) {
    timerElement.textContent = time;
    timerElement.classList.toggle("low", time <= 3);
}

function handleTimeUp() {
    feedbackElement.textContent = `Time's up! The correct answer is: ${currentQuestion.answer}`;
    feedbackElement.className = "wrong";

    submitButton.disabled = true;
    answerInput.disabled = true;

    if(currentQuestionNumber === totalQuestions) {
        playAgainButton.hidden = false;
        nextQuestionButton.hidden = true;
        
        resultContainer.hidden = false;
        finalScoreElement.textContent = score;
    } else {
        playAgainButton.hidden = false;
        nextQuestionButton.hidden = false;
    }
}

operatorButton.forEach((button) => {

    button.addEventListener("click", () => {
        selectedOperator = button.dataset.operator;
        operatorButton.forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
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
    
    feedbackElement.className = "";
    score = 0;
    finalScoreElement.textContent = score;
    scoreElement.textContent = score;
    resultContainer.hidden = true;
    playAgainButton.hidden = true;
    nextQuestionButton.hidden = true;

    currentQuestionNumber = 1;
    numberOfQuestions.textContent = currentQuestionNumber;

    currentQuestion = generateQuestion(selectedOperator, selectedDifficulty);

    startTimer(10, updateTimerDisplay, handleTimeUp);

    questionElement.textContent = `${currentQuestion.number1} ${symbols[selectedOperator]} ${currentQuestion.number2} = ?`
    
    answerInput.value = "";
    feedbackElement.textContent = "";
    
    settings.hidden = true;
    gameContainer.hidden = false;

    submitButton.disabled = false;
    answerInput.disabled = false;
    answerInput.focus();
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
     
    if (playerAnswer === currentQuestion.answer) {
        feedbackElement.textContent = "Correct answer.";
        feedbackElement.className = "correct";
        score++;
        scoreElement.textContent = score;
    } else {
        feedbackElement.textContent = `Wrong answer. Correct answer is: ${currentQuestion.answer}`;
        feedbackElement.className = "wrong";
    }   

    if(currentQuestionNumber === totalQuestions) {
        resultContainer.hidden = false;
        finalScoreElement.textContent = score;

        playAgainButton.hidden = false;
        nextQuestionButton.hidden = true;

    } else {
        playAgainButton.hidden = false;
        nextQuestionButton.hidden = false;
    }
});

playAgainButton.addEventListener("click", () => {
    stopTimer();
    currentQuestionNumber = 1;
    numberOfQuestions.textContent = currentQuestionNumber;
    settings.hidden = false;
    gameContainer.hidden = true;
});

nextQuestionButton.addEventListener("click", () => {
    feedbackElement.className = "";
    currentQuestion = generateQuestion(selectedOperator, selectedDifficulty);
    questionElement.textContent = `${currentQuestion.number1} ${symbols[selectedOperator]} ${currentQuestion.number2} = ?`;

    currentQuestionNumber++;
    numberOfQuestions.textContent = currentQuestionNumber;
    answerInput.value = "";
    feedbackElement.textContent = "";

    submitButton.disabled = false;
    answerInput.disabled = false;
    answerInput.focus();
    playAgainButton.hidden = true;

    startTimer(10, updateTimerDisplay, handleTimeUp);

    nextQuestionButton.hidden = true;
});

answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !submitButton.disabled) {
        submitButton.click();
    }
});