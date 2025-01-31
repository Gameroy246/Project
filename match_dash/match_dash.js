const emojis = [
  "🐱",
  "🐶",
  "🐰",
  "🦊",
  "🐼",
  "🐨",
  "🦁",
  "🐵",
  "🦋",
  "🐢",
  "🦀",
  "🦑",
]; // Customize with your own emojis
const gameGrid = document.getElementById("gameGrid");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let cardPairs = 0;
let attempts = 0;

function createBoard() {
  const shuffledEmojis = emojis.concat(emojis).sort(() => 0.5 - Math.random());
  for (let i = 0; i < shuffledEmojis.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = shuffledEmojis[i];
    card.addEventListener("click", flipCard);
    gameGrid.appendChild(card);
  }
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("matched"))
    return;

  this.textContent = this.dataset.emoji;
  this.style.backgroundColor = "lightgreen";

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  attempts++; // Increment attempts with each try
  document.getElementById("attemptCount").textContent = attempts; // Display attempts count
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  resetBoard();
  cardPairs++;
  checkForWin();
  if (cardPairs === emojis.length) {
    // All pairs have been found, game over logic here
    console.log("Game Over!");
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.textContent = "";
    secondCard.textContent = "";
    firstCard.style.backgroundColor = "white";
    secondCard.style.backgroundColor = "white";
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [lockBoard] = [false];
  [firstCard, secondCard] = [null, null];
}

function hideCards() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.textContent = "";
    card.style.backgroundColor = "white";
  });
  resetBoard();
}

//
function gameOver() {
  document.getElementById("gameOver").style.display = "block";
}

function clearBoard() {
  gameGrid.innerHTML = "";
}

function playAgain() {
  clearBoard();
  createBoard();
  hideCards();
  cardPairs = 0; // Reset cardPairs counter
  attempts = 0; // Reset the attempts counter
  document.getElementById("attemptCount").textContent = attempts; // Update the attempt count display
  document.getElementById("gameOver").style.display = "none"; // Hide the "Game Over" message
}

document.getElementById("playAgain").addEventListener("click", playAgain);

function checkForWin() {
  if (cardPairs === emojis.length) {
    gameOver();
  }
}

createBoard();
hideCards();

// Function to increment the player's score
function updateScore() {
  let points = 3; // Points earned after 1 minute

  // Check if a score already exists in localStorage
  if (localStorage.getItem("playerScore")) {
    // Retrieve the existing score and add the new points
    points += parseInt(localStorage.getItem("playerScore"));
  }

  // Store the updated score in localStorage
  localStorage.setItem("playerScore", points);

  // Display the updated score (optional)
  // document.getElementById('scoreDisplay').textContent = `Your Score: ${points}`;
}

// Call the updateScore function every minute (60,000 milliseconds)
setInterval(updateScore, 60000); // 60000 ms = 1 minute
