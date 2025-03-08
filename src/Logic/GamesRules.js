export const validateMove = (playerRack, tilesUsed) => {
  const rackLetters = playerRack.map((tile) => tile.letter);
  const usedLetters = tilesUsed.map((tile) => tile.letter);

  return usedLetters.every((letter) => {
    const index = rackLetters.indexOf(letter);
    if (index !== -1) {
      rackLetters.splice(index, 1); 
      return true;
    }
    return false;
  });
};

export const validateWordPlacement = (board, newWord, position, direction) => {
  const { row, col } = position;
  const wordLength = newWord.length;

  if (direction === "horizontal" && col + wordLength > 15) return false;
  if (direction === "vertical" && row + wordLength > 15) return false;

  let connectsToExisting = false;
  for (let i = 0; i < wordLength; i++) {
    const currentRow = direction === "horizontal" ? row : row + i;
    const currentCol = direction === "horizontal" ? col + i : col;
    if (board[currentRow][currentCol] !== null) connectsToExisting = true;
  }

  if (!connectsToExisting && !isFirstMove(board)) return false;
  return true;
};

const isFirstMove = (board) => {
  return board[7][7] === null; 
};

export const isValidWord = async (word) => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      console.error(`Response not ok: ${response.status}`);
      return false;
    }
    const data = await response.json();
    return Array.isArray(data);
  } catch (error) {
    console.error("Error validating word:", error);
    return false;
  }
};
