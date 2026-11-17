(() => {
  const cells = [...document.querySelectorAll(".cell")];
  const turnDisplay = document.getElementById("turnDisplay");
  const movesCount = document.getElementById("movesCount");
  const roundLabel = document.getElementById("roundLabel");
  const toast = document.getElementById("toast");
  const scoreEls = {
    X: document.getElementById("scoreX"),
    O: document.getElementById("scoreO"),
    draw: document.getElementById("scoreDraw")
  };

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  let board = Array(9).fill("");
  let currentPlayer = "X";
  let gameOver = false;
  let round = 1;
  let scores = { X: 0, O: 0, draw: 0 };
  let toastTimer;

  function winningLine() {
    return winningLines.find(([a, b, c]) =>
      board[a] && board[a] === board[b] && board[a] === board[c]
    );
  }

  function updateTurn() {
    const tokenClass = currentPlayer === "X" ? "x-token" : "o-token";
    turnDisplay.innerHTML = `<span class="turn-token ${tokenClass}">${currentPlayer}</span><strong>Player ${currentPlayer}'s turn</strong>`;
  }

  function updateScores() {
    scoreEls.X.textContent = scores.X;
    scoreEls.O.textContent = scores.O;
    scoreEls.draw.textContent = scores.draw;
  }

  function updateMoveCount() {
    const count = board.filter(Boolean).length;
    movesCount.textContent = `${count} / 9 MOVES`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
  }

  function render() {
    cells.forEach((cell, index) => {
      const value = board[index];
      cell.textContent = value;
      cell.classList.toggle("x", value === "X");
      cell.classList.toggle("o", value === "O");
      cell.disabled = gameOver || Boolean(value);
      cell.setAttribute("aria-label", `Square ${index + 1}${value ? `, ${value}` : ", empty"}`);
    });
    updateMoveCount();
  }

  function finishGame(winner, line) {
    gameOver = true;
    if (winner) {
      scores[winner] += 1;
      line.forEach(index => cells[index].classList.add("winner"));
      turnDisplay.innerHTML = `<span class="turn-token ${winner === "X" ? "x-token" : "o-token"}">${winner}</span><strong>Player ${winner} wins!</strong>`;
      showToast(`Player ${winner} takes the round!`);
    } else {
      scores.draw += 1;
      turnDisplay.innerHTML = `<span class="turn-token" style="color:#f3c878;background:rgba(243,200,120,.10)">＝</span><strong>It's a draw!</strong>`;
      showToast("A well-played draw. Try again!");
    }
    updateScores();
    render();
  }

  function play(index) {
    if (gameOver || board[index]) return;
    board[index] = currentPlayer;
    const line = winningLine();
    if (line) {
      finishGame(currentPlayer, line);
      return;
    }
    if (board.every(Boolean)) {
      finishGame(null, null);
      return;
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurn();
    render();
  }

  function newGame() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameOver = false;
    round += 1;
    roundLabel.textContent = `ROUND ${String(round).padStart(2, "0")}`;
    cells.forEach(cell => cell.classList.remove("winner"));
    updateTurn();
    render();
  }

  cells.forEach((cell, index) => cell.addEventListener("click", () => play(index)));
  document.getElementById("newGameBtn").addEventListener("click", newGame);
  document.getElementById("resetBtn").addEventListener("click", () => {
    scores = { X: 0, O: 0, draw: 0 };
    updateScores();
    newGame();
    showToast("Scores reset. Fresh match!");
  });

  updateTurn();
  updateScores();
  render();
})();
