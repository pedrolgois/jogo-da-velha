document.addEventListener('DOMContentLoaded', () => {
  const boardContainer = document.getElementById('game-board');
  const result = document.getElementById('result');
  const startButton = document.getElementById('start-button');
  const modeToggle = document.getElementById('mode-toggle');
  const modeInfo = document.getElementById('mode-info');
  const boardSizeSelector = document.getElementById('board-size');
  const gameInfo = document.getElementById('game-info');

  let currentPlayer = 'X';
  let gameBoard = [];
  let gameActive = true;
  let againstComputer = false;
  let boardSize = parseInt(boardSizeSelector.value);

  function startGame() {
    currentPlayer = 'X';
    gameBoard = Array.from({ length: boardSize * boardSize }, () => '');
    gameActive = true;

    // Limpar o tabuleiro
    boardContainer.innerHTML = '';

    // Atualizar o estilo do tabuleiro
    boardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`;

    // Criar células do tabuleiro dinamicamente
    for (let i = 0; i < boardSize * boardSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.addEventListener('click', () => handleCellClick(i));
      boardContainer.appendChild(cell);
    }

    // Reiniciar o jogo
    if (againstComputer && currentPlayer === 'O') {
      setTimeout(makeComputerMove, 500);
    }

    gameInfo.classList.add('hidden')
  }

  function makeMove(index) {
    gameBoard[index] = currentPlayer;
    boardContainer.querySelector(`[data-index="${index}"]`).textContent = currentPlayer;;
  }

  function handleCellClick(index) {
    if (gameActive && !gameBoard[index]) {
      makeMove(index);
      checkWinner();
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (gameActive && againstComputer && currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500);
      }
    }
  }

  function makeComputerMove() {
    const availableCells = gameBoard.reduce((acc, val, index) => {
      if (!val) acc.push(index);
      return acc;
    }, []);

    if (availableCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      makeMove(availableCells[randomIndex]);
      checkWinner();
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    }
  }

  function checkWinner() {
    const winPatterns = [];
    for (let i = 0; i < boardSize; i++) {
      winPatterns.push(Array.from({ length: boardSize }, (_, j) => i * boardSize + j));
      winPatterns.push(Array.from({ length: boardSize }, (_, j) => i + j * boardSize));
    }
    winPatterns.push(Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1)));
    winPatterns.push(Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1)));

    for (const pattern of winPatterns) {
      const winner = pattern.every(index =>gameBoard[index] === currentPlayer);
      if (winner) {
        gameActive = false;
        result.textContent = `Jogador '${currentPlayer}' venceu!`;
        gameInfo.classList.remove('hidden')
        return;
      }
    }

    if (!gameBoard.includes('')) {
      gameActive = false;
      result.textContent = 'Empate!';
      gameInfo.classList.remove('hidden')
    }
  }

  function toggleMode() {
    againstComputer = !againstComputer;

    // Atualizar a informação do modo
    if (againstComputer) {
      modeInfo.textContent = `Modo: Humano vs Computador`;
      if (currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500);
      }
    } else {
      modeInfo.textContent = `Modo: Humano vs Humano`;
    }
  }

  // Adicionar evento de alteração do tamanho do tabuleiro
  boardSizeSelector.addEventListener('change', () => {
    boardSize = parseInt(boardSizeSelector.value);
  });

  // Adicionar evento de clique para alterar o modo
  modeToggle.addEventListener('click', toggleMode);

  // Adicionar evento de clique para iniciar o jogo
  startButton.addEventListener('click', startGame);

  // Inicializar a informação do modo
  modeInfo.textContent = 'Modo: Humano vs Humano';

});
