let timerId = null;

function startTimer(duration, onTick, onTimeUp) {
    clearInterval(timerId);

    let remainingTime = duration;

    onTick(remainingTime);

    timerId = setInterval(() => {
        remainingTime--;

        onTick(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(timerId);
            timerId = null;

            onTimeUp();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}

export { startTimer, stopTimer };