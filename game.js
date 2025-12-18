const gameEl = document.getElementById("game");
const gridSlider = document.getElementById("gridSlider");
const timeSlider = document.getElementById("timeSlider");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");

const gridValue = document.getElementById("gridValue");
const gridValue2 = document.getElementById("gridValue2");
const timeValue = document.getElementById("timeValue");

let size, grid, activeColor, timer, timeLeft;
let connections = {};

const COLORS = {
  red: "#ff4d4d",
  blue: "#4da6ff",
  green: "#4dff88",
  yellow: "#ffd24d",
  purple: "#b84dff",
  cyan: "#4dffff"
};

function startTimer() {
  clearInterval(timer);
  timeLeft = Number(timeSlider.value);
  timerEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) failGame();
  }, 1000);
}

function failGame() {
  clearInterval(timer);
  messageEl.textContent = "❌ SYSTEM FAILURE";
  messageEl.style.color = "#f00";
}

function winGame() {
  clearInterval(timer);
  messageEl.textContent = "✅ PROTOCOL COMPLETE";
  messageEl.style.color = "#0f0";
}

function generateGame() {
  messageEl.textContent = "";
  connections = {};
  activeColor = null;
  size = Number(gridSlider.value);

  gridValue.textContent = size;
  gridValue2.textContent = size;
  timeValue.textContent = timeSlider.value;

  gameEl.innerHTML = "";
  grid = [];

  gameEl.style.gridTemplateColumns = `repeat(${size}, 40px)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    cell.addEventListener("mousedown", () => startPath(cell));
    cell.addEventListener("mouseenter", () => drawPath(cell));
    cell.addEventListener("mouseup", endPath);

    gameEl.appendChild(cell);
    grid.push(cell);
  }

  placeDots();
  startTimer();
}

function placeDots() {
  Object.keys(COLORS)
    .slice(0, Math.floor(size / 2))
    .forEach(color => {
      placeDot(color);
      placeDot(color);
      connections[color] = false;
    });
}

function placeDot(color) {
  let cell;
  do {
    cell = grid[Math.floor(Math.random() * grid.length)];
  } while (cell.dataset.color);

  cell.classList.add("dot");
  cell.style.background = COLORS[color];
  cell.style.color = COLORS[color];
  cell.dataset.color = color;
}

function startPath(cell) {
  if (!cell.dataset.color) return;
  activeColor = cell.dataset.color;
  erasePath(activeColor);
}

function drawPath(cell) {
  if (!activeColor) return;

  // erase other paths if crossed
  if (cell.dataset.path && cell.dataset.path !== activeColor) {
    erasePath(cell.dataset.path);
  }

  cell.classList.add("path");
  cell.style.background = COLORS[activeColor];
  cell.style.color = COLORS[activeColor];
  cell.dataset.path = activeColor;
}

function endPath() {
  if (!activeColor) return;

  const dots = grid.filter(c => c.dataset.color === activeColor);
  const connected = dots.every(d => d.dataset.path === activeColor);

  connections[activeColor] = connected;
  activeColor = null;

  if (Object.values(connections).every(v => v)) {
    winGame();
  }
}

function erasePath(color) {
  grid.forEach(c => {
    if (c.dataset.path === color && !c.dataset.color) {
      c.classList.remove("path");
      c.style.background = "#111";
      delete c.dataset.path;
    }
  });
}

gridSlider.addEventListener("input", generateGame);
timeSlider.addEventListener("input", generateGame);

generateGame();
