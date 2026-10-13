const GAME_SECONDS = 15;
const $ = (selector) => document.querySelector(selector);
const arena = $("#arena");
const target = $("#target");
const message = $("#arenaMessage");
const scoreDisplay = $("#score");
const timeDisplay = $("#time");
const bestDisplay = $("#best");
const statusText = $("#status");
const countdown = $("#countdown");

let score = 0;
let timeLeft = GAME_SECONDS;
let running = false;
let timerId = null;
let best = Number(localStorage.getItem("quicktap_best") || 0);

bestDisplay.textContent = String(best).padStart(2, "0");

function updateScore() {
  scoreDisplay.textContent = String(score).padStart(2, "0");
}
function updateTime() {
  timeDisplay.innerHTML = `${timeLeft}<span class="unit">s</span>`;
  countdown.textContent = `${timeLeft}s`;
}
function moveTarget() {
  const padding = 25;
  const maxX = arena.clientWidth - target.offsetWidth - padding;
  const maxY = arena.clientHeight - target.offsetHeight - padding;
  const x = padding + Math.random() * Math.max(0, maxX - padding);
  const y = padding + Math.random() * Math.max(0, maxY - padding);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}
function startGame() {
  clearInterval(timerId);
  score = 0;
  timeLeft = GAME_SECONDS;
  running = true;
  updateScore();
  updateTime();
  message.classList.add("hidden");
  target.classList.remove("hidden");
  countdown.classList.remove("hidden");
  moveTarget();
  statusText.textContent = "Go go go! Tap the green target.";
  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTime();
    if (timeLeft <= 0) endGame();
  }, 1000);
}
function endGame() {
  running = false;
  clearInterval(timerId);
  target.classList.add("hidden");
  countdown.classList.add("hidden");
  message.classList.remove("hidden");
  const title = message.querySelector("h2");
  const description = message.querySelector("p");
  const button = $("#startBtn");
  title.textContent = score >= 20 ? "Lightning fast!" : score >= 10 ? "Nice reflexes!" : "Good warm-up.";
  description.textContent = `You scored ${score} ${score === 1 ? "point" : "points"} in 15 seconds. Fancy another round?`;
  button.innerHTML = 'Play again <span>→</span>';
  statusText.textContent = score > best ? "New personal best. That was quick!" : "Every round gets a little easier.";
  if (score > best) {
    best = score;
    localStorage.setItem("quicktap_best", String(best));
    bestDisplay.textContent = String(best).padStart(2, "0");
  }
}
target.addEventListener("click", () => {
  if (!running) return;
  score += 1;
  updateScore();
  moveTarget();
});
$("#startBtn").addEventListener("click", startGame);
$("#resetBtn").addEventListener("click", () => {
  clearInterval(timerId);
  running = false;
  score = 0;
  timeLeft = GAME_SECONDS;
  updateScore();
  updateTime();
  target.classList.add("hidden");
  countdown.classList.add("hidden");
  message.classList.remove("hidden");
  message.querySelector("h2").textContent = "One tap at a time.";
  message.querySelector("p").textContent = "Hit start, then tap the moving target.";
  $("#startBtn").innerHTML = 'Start game <span>→</span>';
  statusText.textContent = "You’ve got 15 seconds. Make them count.";
});
window.addEventListener("resize", () => { if (running) moveTarget(); });
