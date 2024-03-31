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

const addTodoBtn = document.getElementById('add-todo-btn');



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


document.addEventListener('DOMContentLoaded', (event) => {
    // Attach event listeners to default item checkboxes
    document.querySelectorAll('.todo-item .complete-btn').forEach(btn => {
        btn.addEventListener('click', completeTodoItem);
    });

    // Add event listener to the Add Item button
    const addTodoBtn = document.getElementById('add-todo-btn');
    addTodoBtn.addEventListener('click', addTodoItem);
});

// Add event listener to the Add Item button
addTodoBtn.addEventListener('click', addTodoItem);

// Function to add a new to-do item
function addTodoItem() {
    const todoList = document.getElementById('todo-list');
    const newItem = document.createElement('div');
    newItem.classList.add('todo-item', 'flex-row'); // 'flex-row' for inline styling

    const completeButton = document.createElement('button');
    completeButton.classList.add('complete-btn');
    completeButton.innerHTML = '&#9634;'; // Unicode square character
    completeButton.addEventListener('click', completeTodoItem);

    const itemText = document.createElement('div');
    itemText.classList.add('todo-text');
    itemText.setAttribute('contenteditable', 'true');
    itemText.textContent = 'New Task';

    newItem.appendChild(completeButton);
    newItem.appendChild(itemText);

    // Insert the new item before the Add Item button
    todoList.insertBefore(newItem, addTodoBtn);
    itemText.focus(); // Focus the new item for editing
}

// Function to mark a to-do item as completed
function completeTodoItem(event) {
    event.preventDefault();
    const item = event.target.parentElement;
    item.classList.toggle('completed');
    const text = item.querySelector('.todo-text');
    text.classList.toggle('strike-through');
    event.target.innerHTML = event.target.innerHTML === '&#9634;' ? '&#9635;' : '&#9634;'; // Toggle square to checked square
}


// Initial setup to mark existing items as complete
document.querySelectorAll('.complete-btn').forEach(btn => {
    btn.addEventListener('click', completeTodoItem);
});

// Ensure this code is at the end of your JS file to avoid hoisting issues
document.addEventListener('DOMContentLoaded', (event) => {
    // Add event listener to the Add Item button
    const addTodoBtn = document.getElementById('add-todo-btn');
    addTodoBtn.addEventListener('click', addTodoItem);

    // Initial setup to mark existing items as complete
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', completeTodoItem);
    });
});

// Event listener to open the goal modal
const setGoalBtn = document.getElementById('set-goal-btn');
const goalModal = document.getElementById('goal-modal');
setGoalBtn.addEventListener('click', () => {
    goalModal.style.display = 'block';
});


// Grab all close buttons and attach event listeners to each
document.querySelectorAll('.close-btn').forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        // Traverse up to the parent modal and hide it
        closeButton.closest('.modal').style.display = 'none';
    });
});

// Handle form submission
const goalForm = document.getElementById('goal-form');
goalForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const goalText = document.getElementById('goal-text').value.trim();
    const goalTime = document.getElementById('goal-time').value;
    displayGoal(goalText, goalTime);
    goalModal.style.display = 'none';
});

// Function to display the goal
function displayGoal(text, time) {
    const goalDisplay = document.getElementById('goal-display');
    goalDisplay.innerHTML = `<strong>Goal:</strong> ${text}  <strong>in </strong> ${time} minutes`;
    goalDisplay.classList.add('goal-set');
}

