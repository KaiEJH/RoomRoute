//CREATES A GRID OF 1s AND 0s FOR SNAKE TO SOLVE - THIS FUNCTION SEEMS TO WORK AS THE GRID IS CREATED AND CELLS GENERATED SEEM TO MATCH.

const buildings = require('./buildingData');

const gridSize = 10;

function createGrid(startCoord, endCoord) {
  
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  const toCellId = ([col, row]) => `${String.fromCharCode(65 + col)}${row + 1}`; //function to convert [3,4] to C4
  

  const blockedCells = new Set();
  const doorCells = new Set();

  //goes through each building (in buildingData) and adds all cells to blocked cells and door to doorcells
  Object.values(buildings).forEach(({ cells, door }) => {
    cells.forEach(cell => blockedCells.add(cell));
    doorCells.add(door);
  });

  const allow = new Set([toCellId(startCoord), toCellId(endCoord), ...doorCells]);//THESE ARE CELLS THAT WOULD NEED TO TEMPORARILY BE ALLOWED

  console.log(allow);

  //Goes through array of cells and checks if it is in the blocked or allowed cells to determine the map snake is solving. Updates grid of 0's with 1's where 1 is a wall and 0 can be passed.
  //IMPORTANT!!! Should be improved where goes through blocked cells and sets that cell in grid array to 1 if not allowed instead - MUCH more efficient
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellId = toCellId([col,row]);
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
  console.log("grid[start][end] =", grid[startCoord[0]][startCoord[1]]);

  return grid;
}


module.exports = createGrid;