import { Grid as Grid2 } from '@mui/material';
import Square from './Square';

const MAP_SIZE = 10; // Can't be greater than 26 due to alphabet limitation
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function Map({ selectedRoom, onSquareSelect }) {
  const selectedCoord = selectedRoom?.coordinates?.toUpperCase(); // e.g., "A4"

  const handleSquareClick = (id) => {
    console.log(`Square ${id} clicked`);
    if (onSquareSelect) {
      onSquareSelect(id);
    }
  };

  let grid = [];

  for (let i = 0; i <= MAP_SIZE; i++) {
    let row = [];

    for (let j = 0; j <= MAP_SIZE; j++) {
      const isLabel = i === 0 || j === 0;
      let content = "";
      const squareId = `${ALPHABET[j - 1]}${i}`; // e.g., A4
      const isSelected = squareId === selectedCoord;

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
            className={`square ${isLabel ? "label-square" : ""} ${isSelected ? "selected" : ""}`}
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


