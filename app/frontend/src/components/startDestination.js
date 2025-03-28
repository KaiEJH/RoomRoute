
export function coordToIndex(coord) {
  if (!coord || typeof coord !== 'string') return null;

  const colLetter = coord[0].toUpperCase(); // e.g., 'A'
  const rowNumber = parseInt(coord.slice(1), 10); // e.g., 4

  const colIndex = colLetter.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, ...
  const rowIndex = rowNumber - 1; // 1-based to 0-based

  return [rowIndex, colIndex]; // [row, col] / [y, x]
}
