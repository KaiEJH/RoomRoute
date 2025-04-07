const Snake = require('snake');
const createGrid = require('./createGrid');
const buildings = require('./buildingData');
const gridSize = 10;

function getBuildingByCell(cell) {
  return Object.entries(buildings).find(([_, { cells }]) => cells.includes(cell));
} 

//NOT USED YET. FOR UPDATING FOR INDOOR TRAVERSAL

function runInternalNavigation(start, end) {
  const startBuilding = getBuildingByCell(start);
  const endBuilding = getBuildingByCell(end);

  let steps = [];

  if (startBuilding) {
    steps.push({ start, end: startBuilding[1].door });
    start = startBuilding[1].door;
  }

  if (endBuilding) {
    steps.push({ start, end: endBuilding[1].door });
    start = endBuilding[1].door;
  }

  steps.push({ start, end }); // final step inside destination

  return steps; // Can then be looped and solved via Snake
}
//Utility function for pathfinding
//Converts to how snake reads coordinates from our top left 0,0 to their bottom left 0,0
function coordConvertForSnake([x, y]) {
  // Convert to bottom-left 0,0 to top-left 0,0
  return [x, gridSize - 1 - y];
}

// THIS IS TO LET SNAKE SOLVE THE MAZE. THE ISSUE MAY INVOLVE THIS SECTION
const runPathfinding = (start, end) => {
  function coordToIndex(coord) {
    const colLetter = coord[0].toUpperCase();       // e.g., 'B'
    const rowNumber = parseInt(coord.slice(1), 10); // e.g., '1'
  
    const col = colLetter.charCodeAt(0) - 65; // 'A' = 0, 'B' = 1, etc.
    const row = rowNumber - 1;                // '1' = 0, '2' = 1, etc.
  
    return [col, row]; // [col, row] format
  }

  const startIndex = coordToIndex(start);
  const endIndex = coordToIndex(end);

  const grid = createGrid(startIndex, endIndex); // (SOMETHING WRONG WITH THIS LINE OR SOMETHING )
  const snakeStartIndex=coordConvertForSnake(startIndex);
  const snakeEndIndex=coordConvertForSnake(endIndex);
  const snake = new Snake();
  const result = snake.solve({
    maze: grid,
    start: snakeStartIndex,
    end: snakeEndIndex,
    heuristic: 'linear', //PROBABLY NEEDS TO BE CHANGED AT SOME POINT. NEED TO SOLVE THE ISSUE TO SEE WHICH METHOD WORKS BEST HERE
  });
  //unsnakes route (converts from bottom right 0,0 to top left 0,0)
  result.route.forEach(route => {
    route[1] = gridSize - 1 - route[1];  // Modify the y-coordinate in place
  });
  return result.route;
};

module.exports = runPathfinding;