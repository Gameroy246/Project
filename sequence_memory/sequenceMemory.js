class SequenceGame {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.level = 1;

        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen'),
            gameOver: document.getElementById('game-over-screen')
        };

        this.grid = document.getElementById('grid');
        this.boxes = [...document.querySelectorAll('.box')];
        this.levelDisplay = document.getElementById('level');
        this.scoreDisplay = document.getElementById('final-score');

        document.getElementById('start-btn').onclick = () => this.start();
        document.getElementById('retry-btn').onclick = () => this.start();
        document.getElementById('theme-toggle').onclick = () => this.toggleTheme();

        this.boxes.forEach((box, index) => {
            box.onclick = () => this.handleClick(index);
        });
    }

    toggleTheme() {
        let bodyClass = document.body.classList;
        bodyClass.toggle('dark');
        localStorage.setItem('theme', bodyClass.contains('dark') ? 'dark' : 'light');
    }

    showScreen(screenName) {
        for (let screen in this.screens) {
            this.screens[screen].classList.toggle('active', screen === screenName);
        }
    }

    start() {
        if (this.isShowingSequence) return;

        this.sequence = [Math.floor(Math.random() * 9)];
        this.playerSequence = [];
        this.level = 1;
        this.isPlaying = true;
        this.levelDisplay.textContent = this.level;

        this.showScreen('game');
        setTimeout(() => this.playSequence(), 500);
    }

    playSequence() {
        this.isShowingSequence = true;
        this.playerSequence = [];
        let index = 0;

        const interval = setInterval(() => {
            this.boxes.forEach(box => box.classList.remove('active'));

            if (index >= this.sequence.length) {
                clearInterval(interval);
                this.isShowingSequence = false;
                return;
            }

            let activeBox = this.boxes[this.sequence[index]];
            activeBox.classList.add('active');

            setTimeout(() => {
                activeBox.classList.remove('active');
                index++;
            }, 300);

        }, 500);
    }

    handleClick(index) {
        if (this.isShowingSequence || !this.isPlaying) return;

        let box = this.boxes[index];
        box.classList.add('active');
        setTimeout(() => box.classList.remove('active'), 200);

        this.playerSequence.push(index);

        if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
            this.isPlaying = false;
            this.scoreDisplay.textContent = this.level - 1;
            this.showScreen('gameOver');
            return;
        }

        if (this.playerSequence.length === this.sequence.length) {
            this.level++;
            this.levelDisplay.textContent = this.level;
            this.sequence.push(Math.floor(Math.random() * 9));
            setTimeout(() => this.playSequence(), 800);
        }
    }
}

window.onload = function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    new SequenceGame();
}