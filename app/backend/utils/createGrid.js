//CREATES A GRID OF 1s AND 0s FOR SNAKE TO SOLVE - THIS FUNCTION SEEMS TO WORK AS THE GRID IS CREATED AND CELLS GENERATED SEEM TO MATCH.

const buildings = require('./buildingData');

const gridSize = 10;

// Building cells = blocked (1), everything else is walkable (0)
const buildingCells = new Set([
  "A3", "A4", "A8", "A9", "A10",
  "B1", "B3", "B4", "B6", "B8", "B9", "B10",
  "C1", "C3", "C4", "C6", "C8", "C9", "C10",
  "D1", "D3", "D4", "D6", "D8", "D9", "D10",
  "E1", "E6",
  "F1", "F3", "F10",
  "G1", "G3", "G10",
  "H7", "H8",
  "I2", "I4", "I5", "I7", "I8",
  "J2", "J3", "J4", "J7", "J8"
]);

function createGrid(startCoord, endCoord) {
  
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  const toCellId = ([col, row]) => `${String.fromCharCode(65 + col)}${row + 1}`;

  const blockedCells = new Set();
  const doorCells = new Set();

  Object.values(buildings).forEach(({ cells, door }) => {
    cells.forEach(cell => blockedCells.add(cell));
    doorCells.add(door);
  });

  const allow = new Set([toCellId(startCoord), toCellId(endCoord), doorCells]);//THESE ARE CELLS THAT WOULD NEED TO TEMPORARILY BE ALLOWED

  console.log(allow);

  for (let row = 1; row <= gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellId = `${String.fromCharCode(65 + col)}${row}`;
      const isBlocked = blockedCells.has(cellId);
      const isAllowed = allow.has(cellId);

      if(isBlocked){
        console.log("Blocked", cellId);
      }
      
      if(isAllowed){
        console.log("Allowed", cellId);
      }

      if (isBlocked && !isAllowed) { //IF BLOCKED AND NOT ALLOWED THEN SET VALUE IN GRID TO 1
        grid[row][col] = 1;
      }
    }
  }

  console.log(startCoord, endCoord)
  console.table(grid)

  console.log("Start:", startCoord, "->", toCellId(startCoord));
  console.log("End:", endCoord, "->", toCellId(endCoord));
  console.log("grid[start][end] =", grid[startCoord[1]][startCoord[0]]);

  return grid;
}


module.exports = createGrid;