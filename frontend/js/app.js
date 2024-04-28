function fetchAndDisplayImages() {
    
    fetch('http://localhost:3000/api/images')

        .then(response => response.json())
        .then(images => displayImages(images))
        .catch(error => console.error('Error fetching images:', error));

        /*
        // hard coding an example of image upload
        var img = document.createElement('img'); 
        img.imagePath = '../backend/uploads/1714069297986.jpeg'; 
        displayImages([img])
        */
}

function displayImages(images) {
    console.log(images);
    const gallery = document.getElementById('image-gallery');
    gallery.innerHTML = '<h3>Recent Goals</h3>';
    images.forEach(image => {
        console.log(image)
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
}


function checkAuthState() {
    const token = sessionStorage.getItem('token');
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            logoutBtn.style.display = 'block';
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
        } catch (error) {
            console.error('Error parsing the token:', error);
            sessionStorage.removeItem('token'); // Handle corrupted token
        }
    } else {
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
    }
}

function initializeTimer() {
    const timerDisplay = document.getElementById('time-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    let countdown;
    let isTimerRunning = false;
    let pomodoroTime = 25 * 60;
    let timeLeft = pomodoroTime;

    startBtn.addEventListener('click', () => {
        if (!isTimerRunning) {
            startTimer(timeLeft);
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

    function startTimer(seconds) {
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
}

document.addEventListener('DOMContentLoaded', (event) => {
    /*
    document.getElementById('auth-link').addEventListener('click', () => {
        document.getElementById('auth-modal').style.display = 'block';
    });
    */

    // document.getElementById('toggle-register').addEventListener('change', toggleAuthForm);

    // document.getElementById('auth-form').addEventListener('submit', handleAuth);

    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Initialize all components
    initializeTimer();
    checkAuthState();
    fetchAndDisplayImages();

    console.log('STARTED');

   
    const timerDisplay = document.getElementById('time-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');

    const customizeBtn = document.getElementById('customize-btn');
    const customizeModal = document.getElementById('customize-modal');
    const applyCustomTimersBtn = document.getElementById('apply-custom-timers');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegistration);

    let isTimerRunning = false;
    const pomodoroTime = 25 * 60; // 25 minutes in seconds
    let timeLeft = pomodoroTime;

    function timer(seconds) {
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

    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
    
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                sessionStorage.setItem('token', data.token);
                document.getElementById('login-modal').style.display = 'none';
                alert('Login successful!');
                // Additional code to handle logged-in state
            } else {
                document.getElementById('login-error').textContent = 'Login failed: ' + (data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('login-error').textContent = error.message;
        });
    }
    
    // Handle registration
    function handleRegistration(event) {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
    
        // Simple client-side validation for example purposes
        if (password !== confirmPassword) {
            document.getElementById('register-error').textContent = "Passwords do not match";
            return;
        }
    
        fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                sessionStorage.setItem('token', data.token);
                document.getElementById('register-modal').style.display = 'none';
                alert('Registration successful!');
                // Additional code to handle logged-in state
            } else {
                document.getElementById('register-error').textContent = 'Registration failed: ' + (data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('register-error').textContent = error.message;
        });
    }
    
    
    function handleLogout() {
        sessionStorage.removeItem('token');
        checkAuthState();
    }

    document.getElementById('login-btn').addEventListener('click', () => {
        document.getElementById('login-modal').style.display = 'block';
    });
    
    document.getElementById('register-btn').addEventListener('click', () => {
        document.getElementById('register-modal').style.display = 'block';
    });

    document.getElementById('logout-btn').addEventListener('click', function(e) {
        // Clear session storage or cookies
        sessionStorage.removeItem('token');
        // Update UI to reflect logged out state
        checkAuthState();
        // Optionally, make a request to the backend to invalidate the token/session
    });


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
    
    
    // Function to open the upload picture modal
    document.getElementById('upload-pic-btn').addEventListener('click', () => {
        document.getElementById('upload-pic-modal').style.display = 'block';
    });

    // Function to close the modal
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Prevent the default form submission and use FormData to send image
    document.getElementById('upload-pic-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const token = sessionStorage.getItem('token');

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            formData.append('userId', payload.userId); // Append userId to the form data
        }

        fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        // Include the Authorization header with the token
        headers: { 
            'Authorization': 'Bearer ' + token
        },
        body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Status: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.getElementById('upload-pic-modal').style.display = 'none';
            fetchAndDisplayImages();
        })
        .catch((error) => {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        });
    });


});

