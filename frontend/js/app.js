function fetchAndDisplayImages() {
    fetch('http://localhost:3000/api/images') // Adjust URL to match your backend endpoint
        .then(response => response.json())
        .then(images => {
            const gallery = document.getElementById('image-gallery');
            gallery.innerHTML = ''; // Clear existing images
            images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.imagePath;
                imgElement.alt = 'User uploaded image';
                
                const caption = document.createElement('div');
                caption.textContent = image.goal;
                
                const container = document.createElement('div');
                container.appendChild(imgElement);
                container.appendChild(caption);

                gallery.appendChild(container);
            });
        })
        .catch(error => console.error('Error fetching images:', error));
}


document.addEventListener('DOMContentLoaded', (event) => {
    fetchAndDisplayImages();

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
    



    // Attach event listeners to default item checkboxes
    document.querySelectorAll('.todo-item .complete-btn').forEach(btn => {
        btn.addEventListener('click', completeTodoItem);
    });

    // Add event listener to the Add Item button
    const addTodoBtn = document.getElementById('add-todo-btn');
    addTodoBtn.addEventListener('click', addTodoItem);

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
    
    // Registration form logic
    document.getElementById('registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        // Your fetch call for registration here
        // On success, you can close the registration modal and clear the form, or redirect, etc.
        // On error, display the error message in the 'register-error' div
    });
    
    
    // Event listeners to close modals
    document.querySelectorAll('.close-btn').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            closeButton.closest('.modal').style.display = 'none';
        });
    });

    document.getElementById('register-link').addEventListener('click', () => {
        document.getElementById('registration-modal').style.display = 'block';
    });

    // Function to open the upload picture modal
    document.getElementById('upload-pic-btn').addEventListener('click', () => {
        document.getElementById('upload-pic-modal').style.display = 'block';
    });

    // Function to close the modal
    document.querySelectorAll('.close-btn').forEach(button => {
        button.onclick = function() {
            this.closest('.modal').style.display = 'none';
        };
    });

    // Prevent the default form submission and use FormData to send image
    document.getElementById('upload-pic-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);

        // Replace URL with your actual endpoint URL
        fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log(data);
            // Process the response data (e.g., show a success message, close the modal)
            document.getElementById('upload-pic-modal').style.display = 'none';
            fetchAndDisplayImages();
        })
        .catch((error) => {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
            // Handle errors (e.g., show an error message)
        });
    });


});

