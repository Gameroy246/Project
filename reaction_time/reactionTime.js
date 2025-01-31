class GameHandler {
    constructor() {
        this.attemptLimit = 1; 
        this.attemptNumber = 0;
        this.times = [];
        this.timeout = null;
        this.startTimestamp = 0;
        this.waiting = true;

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.screens = {
            start: document.getElementById('startScreen'),
            game: document.getElementById('gameScreen'),
            results: document.getElementById('resultsScreen'),
        };

        this.currentAttemptDisplay = document.getElementById('currentAttempt');
        this.displays = {
            lastTime: document.getElementById('lastTime'),
            bestTime: document.getElementById('bestTime'),
            avgTime: document.getElementById('avgTime'),
            finalAverage: document.getElementById('finalAverage'),
            finalBest: document.getElementById('finalBest'),
        };

        // New element for failure message
        this.failureMessage = document.createElement('div');
        this.failureMessage.id = 'failureMessage';
        this.failureMessage.style.display = 'none'; // Initially hidden
        this.failureMessage.style.color = 'red'; // Set text color
        this.failureMessage.style.fontSize = '24px'; // Set font size
        this.failureMessage.style.fontWeight = 'bold'; // Set font weight
        this.failureMessage.style.position = 'absolute'; // Positioning
        this.failureMessage.style.top = '50%'; // Center vertically
        this.failureMessage.style.left = '50%'; // Center horizontally
        this.failureMessage.style.transform = 'translate(-50%, -50%)'; // Centering transform
        document.body.appendChild(this.failureMessage);
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('retryBtn').addEventListener('click', () => this.startGame());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('gameScreen').addEventListener('click', () => this.handleClick());
    }

    toggleTheme() {
        document.body.classList.toggle('dark');
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach((screen) => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    startGame() {
        this.currentAttempt = 0; 
        this.times = [];
        document.body.style.backgroundColor = '#4CAF50'; // Set background color to green
        this.failureMessage.style.display = 'none'; // Hide failure message
        this.showScreen('game');
        this.setReadyState(); 
    }

    setReadyState() {
        this.startTime = Date.now(); 

        const randomDelay = Math.random() * 6000 + 1000; // Random delay between 1 and 7 seconds
        setTimeout(() => {
            this.changeBackgroundColor(); // Change color before showing results
            this.showResults(); 
        }, randomDelay);
    }

    changeBackgroundColor() {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.backgroundColor = randomColor; // Set random background color
    }

    handleClick() {
        const currentTime = Date.now();
        if (currentTime < this.startTime + 1000) { // Check if clicked early
            this.handleEarlyClick();
        } else {
            this.handleValidClick();
        }
    }

    handleEarlyClick() {
        this.failureMessage.textContent = 'You have failed! Click to try again.';
        this.failureMessage.style.display = 'block'; // Show failure message
        this.failureMessage.onclick = () => this.startGame(); // Restart game on click
    }

    handleValidClick() {
        const time = (Date.now() - this.startTime) / 1000;
        this.times.push(time);
        this.showResults(); 
    }

    showResults() {
        const avgTime = this.times.reduce((a, b) => a + b) / this.times.length;
        const bestTime = Math.min(...this.times);

        this.displays.finalAverage.textContent = `${avgTime.toFixed(3)}s`;
        this.displays.finalBest.textContent = `${bestTime.toFixed(3)}s`;

        this.showScreen('results');
    }
}

const gameHandler = new GameHandler();
