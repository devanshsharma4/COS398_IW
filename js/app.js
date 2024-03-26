let countdown;
const timerDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');

const customizeBtn = document.getElementById('customize-btn');
const customizeModal = document.getElementById('customize-modal');
const closeBtn = document.getElementsByClassName('close-btn')[0];
const customTimersForm = document.getElementById('custom-timers-form');
const applyCustomTimersBtn = document.getElementById('apply-custom-timers');



let isTimerRunning = false;
const pomodoroTime = 25 * 60; // 25 minutes in seconds
let timeLeft = pomodoroTime;

function timer(seconds) {
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        timeLeft = Math.round((then - Date.now()) / 1000);

        if (timeLeft < 0) {
            clearInterval(countdown);
            return;
        }

        displayTimeLeft(timeLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;
}

function setTimer(seconds) {
    clearInterval(countdown);
    timeLeft = seconds;
    displayTimeLeft(timeLeft);
    isTimerRunning = false;
}

startBtn.addEventListener('click', () => {
    if (!isTimerRunning) {
        timer(timeLeft);
        isTimerRunning = true;
    }
});

pauseBtn.addEventListener('click', () => {
    clearInterval(countdown);
    isTimerRunning = false;
});

resetBtn.addEventListener('click', () => {
    clearInterval(countdown);
    displayTimeLeft(pomodoroTime);
    timeLeft = pomodoroTime;
    isTimerRunning = false;
});

// Applying custom timer lengths
applyCustomTimersBtn.addEventListener('click', function(event){
    event.preventDefault(); // Prevent form submission which refreshes the page

    // Retrieve the custom values from the input fields
    const pomodoroValue = parseInt(document.getElementById('pomodoro-custom').value, 10);
    const shortBreakValue = parseInt(document.getElementById('short-break-custom').value, 10);
    const longBreakValue = parseInt(document.getElementById('long-break-custom').value, 10);

    // Check if the values are numbers and greater than 0
    if (isFinite(pomodoroValue) && pomodoroValue > 0 &&
        isFinite(shortBreakValue) && shortBreakValue > 0 &&
        isFinite(longBreakValue) && longBreakValue > 0) {
        
        // Update custom timer lengths
        customPomodoro = pomodoroValue * 60;
        customShortBreak = shortBreakValue * 60;
        customLongBreak = longBreakValue * 60;

        // Reset the timer to the new Pomodoro length
        setTimer(customPomodoro);

        // Close the modal
        customizeModal.style.display = 'none';
    } else {
        alert('Please enter positive numbers for all timer lengths.');
    }
});

// Event listeners for the timer options
pomodoroBtn.addEventListener('click', () => setTimer(customPomodoro));
shortBreakBtn.addEventListener('click', () => setTimer(customShortBreak));
longBreakBtn.addEventListener('click', () => setTimer(customLongBreak));

// Function to open the customization modal
customizeBtn.addEventListener('click', () => {
    customizeModal.style.display = 'block';
});

// Function to close the customization modal
closeBtn.addEventListener('click', () => {
    customizeModal.style.display = 'none';
});


