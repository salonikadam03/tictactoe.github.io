const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const fireworksCanvas = document.getElementById('fireworksCanvas');
const ctx = fireworksCanvas.getContext('2d');
let currentPlayer = 'X';
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Resize canvas to cover the whole page
function resizeCanvas() {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let fireworks = [];

// Firework particle class
class Firework {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size || Math.random() * 5 + 5;
    this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    this.particles = [];
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * this.size,
        alpha: 1,
      });
    }
  }

  draw() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 0.02;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = particle.alpha;
      ctx.fill();
    });

    this.particles = this.particles.filter(p => p.alpha > 0);
    return this.particles.length > 0;
  }
}

function triggerFireworks() {
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height;
    fireworks.push(new Firework(x, y, 10));
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fireworks = fireworks.filter(firework => firework.draw());
  requestAnimationFrame(animateFireworks);
}
animateFireworks();

function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute('data-index');

  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (checkWin()) {
    statusText.textContent = `🎉🎉🎉🎉 Player ${currentPlayer} Wins! 🎉🎉🎉🎉`;
    statusText.style.color = '#ed128a'; // Change status color to red
    gameActive = false;

    // Trigger fireworks
    setTimeout(() => {
      triggerFireworks();
    }, 500);

    return;
  }

  if (board.every(cell => cell !== '')) {
    statusText.textContent = "It's a Draw! 🤝";
    statusText.style.color = '#ed128a'; // Change status color to red
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn 🤗`;
  statusText.style.color = '#ed128a'; // Change status color to red
}

function checkWin() {
  return winningCombinations.some(combination =>
    combination.every(index => board[index] === currentPlayer)
  );
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player X's Turn 🤗`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
