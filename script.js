const boardElement = document.getElementById("board");
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  timerElement.textContent = `Tiempo: ${formatTime(seconds)}`;

  timerInterval = setInterval(() => {
    seconds++;
    timerElement.textContent = `Tiempo: ${formatTime(seconds)}`;
  }, 1000);
}

function saveBestTime() {
  let times = JSON.parse(localStorage.getItem("sudokuTimes")) || [];
  times.push(seconds);
  times.sort((a, b) => a - b);
  times = times.slice(0, 5);
  localStorage.setItem("sudokuTimes", JSON.stringify(times));
  renderBestTimes();
}

function renderBestTimes() {
  const times = JSON.parse(localStorage.getItem("sudokuTimes")) || [];
  bestTimesElement.innerHTML = times
    .map(time => `<li>${formatTime(time)}</li>`)
    .join("");
}

function checkCompletion() {
  const complete = board.every(row => row.every(cell => cell !== 0));
  if (complete) {
    clearInterval(timerInterval);
    saveBestTime();
  }
}

function startGame() {
  solution = generateSolvedBoard();
  board = createPuzzle(solution, difficultySelect.value);
  selectedCell = null;
  renderBoard();
  startTimer();
  renderBestTimes();
}

newGameBtn.addEventListener("click", startGame);

function validateBoard() {
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('error'));
  const cells = document.querySelectorAll('.cell');

  cells.forEach(cell => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = board[row][col];
    if (!value) return;

    cells.forEach(other => {
      if (cell === other) return;
      const r = Number(other.dataset.row);
      const c = Number(other.dataset.col);
      const otherValue = board[r][c];
      if (!otherValue) return;

      const sameBox = Math.floor(row / 3) === Math.floor(r / 3) && Math.floor(col / 3) === Math.floor(c / 3);

      if (value === otherValue && (row === r || col === c || sameBox)) {
        cell.classList.add('error');
        other.classList.add('error');
      }
    });
  });
}

themeToggle.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark");
  themeToggle.textContent = dark ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
});

startGame();
