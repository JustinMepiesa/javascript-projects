const settings  = document.querySelector(".settings")
const operatorButton = document.querySelectorAll(".operator-options button");
const difficulty = document.querySelector("#difficulty");
const startButton = document.querySelector("#startButton");
const gameContainer = document.querySelector("#gameContainer");

let selectedOperator = null;
let selectedDifficulty = "easy";

operatorButton.forEach((button) => {

    button.addEventListener("click", () => {
        selectedOperator = button.dataset.operator;
        console.log(selectedOperator);
    });
});

difficulty.addEventListener("change", () => {
    selectedDifficulty = difficulty.value;
    console.log(selectedDifficulty);
});

startButton.addEventListener("click", () => {
    if(selectedOperator === null) {
        alert("Please select an operator.");
        return;
    }

    settings.hidden = true;
    gameContainer.hidden = false;
});