const board = document.getElementById("board");
const statusElement = document.getElementById("status");
const playerSelection = document.getElementById("playerType");
const resetButton = document.getElementById("resetButton");
const statsElement = document.getElementById("stats");

let currentPlayer = "X";
let gameOver = false;
let computerPlayer = false;

let gameCount = 0;
let player1Wins = 0;
let player2Wins = 0;
let computerWins = 0;
let ties = 0;

playerSelection.addEventListener("change", () => {
  computerPlayer = playerSelection.value === "1";
  resetGame();
});

function resetGame() {
  Array.from(document.querySelectorAll(".cell")).forEach((cell) => {
    cell.textContent = "";
  });
  statusElement.textContent = "";
  currentPlayer = "X";
  gameOver = false;
  resetButton.style.display = "none";

  if (computerPlayer && currentPlayer === "0") {
    makeComputerMove();
  }
  gameCount++;
  updateStats();
}

for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  cell.addEventListener("click", handleCellClick);
  board.appendChild(cell);
}

function handleCellClick(event) {
  if (gameOver) return;

  const cell = event.target;
  if (cell.textContent === "") {
    cell.textContent = currentPlayer;
    if (checkWinner()) {
      statusElement.textContent = `${currentPlayer} wins!`;
      gameOver = true;

      if (currentPlayer === "X") {
        player1Wins++;
      } else if (currentPlayer === "O" && computerPlayer) {
        computerWins++;
      } else {
        player2Wins++;
      }
    } else if (isBoardFull()) {
      statusElement.textContent = "It's a Draw!";
      gameOver = true;
      ties++;
    } else {
      switchPlayers();
      if (computerPlayer && currentPlayer === "O") {
        makeComputerMove();
      }
    }
    updateStats();
    if (gameOver) {
      resetButton.style.display = "block";
    }
  }
}

function switchPlayers() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function makeComputerMove() {
  if (gameOver) return;

  const emptyCells = Array.from(document.querySelectorAll(".cell")).filter(
    (cell) => cell.textContent === ""
  );
  if (emptyCells.length === 0) return;

  for (const cell of emptyCells) {
    cell.textContent = "O";
    if (checkWinner()) {
      statusElement.textContent = "Computer wins!";
      gameOver = true;
      computerWins++;
      updateStats();
      return;
    }
    cell.textContent = "";
  }
  for (const cell of emptyCells) {
    cell.textContent = "X";
    if (checkWinner()) {
      cell.textContent = "O";
      switchPlayers();
      return;
    }
    cell.textContent = "";
  }
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const computerCell = emptyCells[randomIndex];
  computerCell.textContent = currentPlayer;

  if (checkWinner()) {
    statusElement.textContent = "Computer wins!";
    gameOver = true;
    computerWins++;
  } else if (isBoardFull()) {
    statusElement.textContent = "It's a draw!";
    gameOver = true;
    ties++;
  } else {
    switchPlayers();
  }

  updateStats();
}

function checkWinner() {
  const cells = document.querySelectorAll(".cell");

  for (let i = 0; i < 3; i++) {
    if (
      cells[i * 3].textContent &&
      cells[i * 3].textContent === cells[i * 3 + 1].textContent &&
      cells[i * 3].textContent === cells[i * 3 + 2].textContent
    ) {
      return true;
    }

    if (
      cells[i].textContent &&
      cells[i].textContent === cells[i + 3].textContent &&
      cells[i].textContent === cells[i + 6].textContent
    ) {
      return true;
    }
  }

  if (
    cells[0].textContent &&
    cells[0].textContent === cells[4].textContent &&
    cells[0].textContent === cells[8].textContent
  ) {
    return true;
  }

  if (
    cells[2].textContent &&
    cells[2].textContent === cells[4].textContent &&
    cells[2].textContent === cells[6].textContent
  ) {
    return true;
  }

  return false;
}

function isBoardFull() {
  const cells = document.querySelectorAll(".cell");
  return Array.from(cells).every((cell) => cell.textContent !== "");
}

function updateStats() {
  statsElement.textContent = `Games Played: ${gameCount} | Player 1 Wins: ${player1Wins} | Player 2 Wins: ${player2Wins} | Computer Wins: ${computerWins} | Ties: ${ties}`;
}

resetGame();
