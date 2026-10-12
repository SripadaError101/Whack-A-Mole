// Simple Whack-a-Mole game logic
const holes = Array.from(document.querySelectorAll('.hole'));
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('startBtn');

let lastHole = null;
let timeLimit = 30; // seconds
let timeLeft = timeLimit;
let score = 0;
let gameTimer = null;
let moleTimer = null;
let running = false;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) return randomHole(holes);
  lastHole = hole;
  return hole;
}

function showMole() {
  const time = randomTime(500, 1100); // mole visible duration
  const hole = randomHole(holes);
  hole.classList.add('up');

  // create mole element if absent
  if (!hole.querySelector('.mole')) {
    const mole = document.createElement('div');
    mole.className = 'mole';
    mole.textContent = '👊';
    hole.appendChild(mole);

    // click/tap handler
    mole.addEventListener('click', whack);
    mole.addEventListener('touchstart', whack, {passive: true});
  }

  // hide mole after time
  moleTimer = setTimeout(() => {
    hole.classList.remove('up');
    // keep the mole element for reuse
    if (running) showMole();
  }, time);
}

function whack(e) {
  if (!running) return;
  const mole = e.currentTarget;
  const hole = mole.parentElement;
  // ensure mole is visible
  if (!hole.classList.contains('up')) return;
  score++;
  scoreEl.textContent = score;
  // quick hide to give feedback
  hole.classList.remove('up');
  // small pop feedback
  mole.style.transform = 'scale(0.9)';
  setTimeout(() => mole.style.transform = '', 100);
}

function updateTimer() {
  timeLeft--;
  timeEl.textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function startGame() {
  if (running) return;
  running = true;
  score = 0;
  scoreEl.textContent = score;
  timeLeft = timeLimit;
  timeEl.textContent = timeLeft;
  startBtn.disabled = true;
  startBtn.textContent = 'Playing...';
  // start mole loop
  showMole();
  // start countdown
  gameTimer = setInterval(updateTimer, 1000);
}

function endGame() {
  running = false;
  clearInterval(gameTimer);
  clearTimeout(moleTimer);
  // hide any visible mole
  holes.forEach(h => h.classList.remove('up'));
  startBtn.disabled = false;
  startBtn.textContent = 'Start';
  // simple alert with result
  setTimeout(() => {
    alert(`Time's up! Your score: ${score}`);
  }, 100);
}

startBtn.addEventListener('click', startGame);

// keyboard accessibility: press Enter/Space on a hole to attempt whack
holes.forEach(hole => {
  hole.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const mole = hole.querySelector('.mole');
      if (mole) whack({ currentTarget: mole });
    }
  });
});
