const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cellSize = 5;
let width, height, cols, rows;
let grid, nextGrid;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width;
  height = canvas.height;
  cols = Math.floor(width / cellSize);
  rows = Math.floor(height / cellSize);
}

function initializeGrid() {
  resizeCanvas();

  grid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
  nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

  // Randomly populate the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = Math.random() > 0.8 ? 1 : 0;
    }
  }
}

function drawGrid() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#00FF00";
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
}

function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function updateGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbors = countNeighbors(i, j);
      if (grid[i][j] === 0 && neighbors === 3) {
        nextGrid[i][j] = 1;
      } else if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGrid[i][j] = 0;
      } else {
        nextGrid[i][j] = grid[i][j];
      }
    }
  }
  [grid, nextGrid] = [nextGrid, grid];
}

let intervalId;
function animate() {
  updateGrid();
  drawGrid();
}

function startAnimation() {
  if (intervalId) clearInterval(intervalId);
  let speed = 3;
  intervalId = setInterval(animate, speed * 10);
}

document.getElementById("reset").addEventListener("click", () => {
  initializeGrid();
  drawGrid();
  startAnimation();
});

window.onload = function () {
  initializeGrid();
  drawGrid();
  startAnimation();
};

window.addEventListener('resize', () => {
  initializeGrid();
  startAnimation();
});
