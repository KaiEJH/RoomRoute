import { Grid2 } from '@mui/material';
import Square from './Square';

const MAP_SIZE = 10; // Can't be greater than 26 due to alphabet limitation
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const buildingCells = new Set([
  "A3", "A4", "A8", "A9", "A10", "B1", "B3", "B4", "B6", "B8", "B9", "B10",
  "C1", "C3", "C4", "C6", "C8", "C9", "C10", "D1", "D3", "D4", "D6", "D8", "D9", "D10",
  "E1", "E6", "F1", "F3", "F10", "G1", "G3", "G10", "H7", "H8", "I2", "I4", "I5", "I7", "I8", "J2", "J4", "J5", "J7", "J8"
]);



function Map({ selectedRoom, startRoom, destinationRoom, onSquareSelect }) {
  const selectedCoord = selectedRoom?.coordinates?.toUpperCase(); // e.g., "A4"
  const startCoord = startRoom?.coordinates?.toUpperCase();
  const destCoord = destinationRoom?.coordinates?.toUpperCase();

  const handleSquareClick = (id) => {
    if (!buildingCells.has(id)) return;
    if (onSquareSelect) {
      onSquareSelect(id);
    }
  }

  let grid = [];

  for (let i = 0; i <= MAP_SIZE; i++) {
    let row = [];

    for (let j = 0; j <= MAP_SIZE; j++) {
      const isLabel = i === 0 || j === 0;
      let content = "";
      const squareId = `${ALPHABET[j - 1]}${i}`; // e.g., A4
      const isSelected = squareId === selectedCoord;
      const isBuilding = buildingCells.has(squareId);

      if (i === 0 && j === 0) {
        content = ""; // empty top-left
      } else if (i === 0) {
        content = ALPHABET[j - 1]; // column header
      } else if (j === 0) {
        content = i; // row header
      }

      row.push(
        <Grid2 key={`cell-${i}-${j}`}>
          <Square
            id={squareId}
            isLabel={isLabel}
            onClick={handleSquareClick}
            className={`square ${isLabel ? "label-square" : ""}
                ${isSelected ? "selected" : ""}
                ${squareId === startCoord ? "start-square" : ""}
                ${squareId === destCoord ? "destination-square" : ""}
                ${isBuilding ? "building-cell" : ""}
                `}
          >
            {content}
          </Square>
        </Grid2>
      );
    }

    grid.push(
      <Grid2 container key={`row-${i}`} spacing={1} wrap="nowrap">
        {row}
      </Grid2>
    );
  }

  return (
    <Grid2 container spacing={1} direction="column">
    {grid}
  </Grid2>
  );
}

export default Map;


