const gameEl = document.getElementById("game");
const slider = document.getElementById("gridSlider");
const gridValue = document.getElementById("gridValue");
const gridValue2 = document.getElementById("gridValue2");

let size = Number(slider.value);
let grid = [];
let activeColor = null;

const COLORS = {
  red: "#ff4d4d",
  blue: "#4da6ff",
  green: "#4dff88",
  yellow: "#ffd24d",
  purple: "#b84dff",
  cyan: "#4dffff"
};

slider.addEventListener("input", () => {
  size = Number(slider.value);
  gridValue.textContent = size;
  gridValue2.textContent = size;
  generateGame();
});

function generateGame() {
  gameEl.innerHTML = "";
  grid = [];
  activeColor = null;

  gameEl.style.gridTemplateColumns = `repeat(${size}, 40px)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    gameEl.appendChild(cell);
    grid.push(cell);

    cell.addEventListener("mousedown", () => startPath(cell));
    cell.addEventListener("mouseenter", () => drawPath(cell));
    cell.addEventListener("mouseup", endPath);
  }

  placeDots();
}

function placeDots() {
  const keys = Object.keys(COLORS);
  const pairs = Math.min(keys.length, Math.floor(size / 2));

  for (let i = 0; i < pairs; i++) {
    const color = keys[i];
    placeDot(color);
    placeDot(color);
  }
}

function placeDot(color) {
  let cell;
  do {
    cell = grid[Math.floor(Math.random() * grid.length)];
  } while (cell.dataset.color);

  cell.classList.add("dot");
  cell.style.background = COLORS[color];
  cell.dataset.color = color;
}

function startPath(cell) {
  if (!cell.dataset.color) return;
  activeColor = cell.dataset.color;
}

function drawPath(cell) {
  if (!activeColor) return;
  if (cell.dataset.color && cell.dataset.color !== activeColor) return;

  cell.classList.add("path");
  cell.style.background = COLORS[activeColor];
  cell.dataset.path = activeColor;
}

function endPath() {
  activeColor = null;
}

generateGame();
