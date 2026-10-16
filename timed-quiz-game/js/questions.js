function generateRandomNumbers(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateQuestion(operator, difficulty) {
    let maxNumber;

    if(difficulty === "easy") {
        maxNumber = 10;
    } else if(difficulty === "medium") {
        maxNumber = 50;
    } else if (difficulty === "hard") {
        maxNumber = 100;
    }

    let number1 = generateRandomNumbers(1, maxNumber);
    let number2 = generateRandomNumbers(1, maxNumber);
    let answer = 0;

    if(operator === "/") {
        answer = generateRandomNumbers(1, maxNumber);
        number1 = number2 * answer;
    }

    switch (operator) {
        case "+":
            answer = number1 + number2
            break;

        case "-":
            if(number2 > number1) {
                answer = number2 - number1;
            } else {
                answer = number1 - number2;
            }
            
            break;

         case "*":
            answer = number1 * number2
            break;   

        default:
            break;
    }

    return { number1, number2, answer};
}

export { generateRandomNumbers, generateQuestion };