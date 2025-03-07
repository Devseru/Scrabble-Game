import React, { useState, useEffect } from "react";
import "../css/Board.css";
import ScoreBoard from "./ScoreBoard";
import Rack from "./Rack";
import { calculateScores } from "../Logic/Scoring"; 

// Example bonus squares mapping
const bonusSquares = {
  "0101": "TW", "0104": "DL", "0108": "TW", "0112": "DL", "0115": "TW",
  "0202": "DW", "0206": "TL", "0210": "TL", "0214": "DW", "0303": "DW",
  "0307": "DL", "0309": "DL", "0313": "DW", "0401": "DL", "0404": "DW",
  "0408": "DL", "0412": "DW", "0415": "DL", "0505": "DW", "0511": "DW",
  "0602": "TL", "0606": "TL", "0610": "TL", "0614": "TL", "0703": "DL",
  "0707": "DL", "0709": "DL", "0713": "DL", "0801": "TW", "0804": "DL",
  "0808": "centerTile", "0812": "DL", "0815": "TW", "0903": "DL", "0907": "DL",
  "0909": "DL", "0913": "DL", "1002": "TL", "1006": "TL", "1010": "TL",
  "1014": "TL", "1105": "DW", "1111": "DW", "1201": "DL", "1204": "DW",
  "1208": "DL", "1212": "DW", "1215": "DL", "1303": "DW", "1307": "DL",
  "1309": "DL", "1313": "DW", "1402": "DW", "1406": "TL", "1410": "TL",
  "1414": "DW", "1501": "TW", "1504": "DL", "1512": "DL", "1515": "TW",
};

const Board = () => {
  const boardSize = 15;

  // State for scores, turn, timer
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1); 
  const [timeLeft, setTimeLeft] = useState(60);

  // boardTiles holds the permanent letters on the board;
  // placedTiles holds the letters placed during the current move.
  const [boardTiles, setBoardTiles] = useState({});
  const [placedTiles, setPlacedTiles] = useState([]);

  // Simple dictionary for word validation
  const dictionary = ["HELLO", "WORLD", "TEST", "EXAMPLE"];

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      console.log(`Player ${currentPlayer} ran out of time! Switching turns.`);
      setTimeout(() => {
        switchTurn();
      }, 1000);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Click handler to remove a tile placed in the current move.
  const handleTileClick = (cellId) => {
    // Only allow removal if this tile is part of the current move.
    const tileInCurrentMove = placedTiles.find(tile => tile.position === cellId);
    if (!tileInCurrentMove) return;

    // Remove from placedTiles and boardTiles.
    setPlacedTiles(prev => prev.filter(tile => tile.position !== cellId));
    setBoardTiles(prev => {
      const newBoard = { ...prev };
      delete newBoard[cellId];
      return newBoard;
    });
    console.log(`Removed tile from cell ${cellId}`);
  };

  // Handle dropping a tile onto a cell
  const handleDrop = (e, cellId) => {
    e.preventDefault();
    const tileData = e.dataTransfer.getData("tile"); 
    if (!tileData) return;
    // Prevent overriding a tile in a cell (cannot drop on a cell that already has a permanent tile)
    if (boardTiles[cellId]) {
      alert("This cell already has a tile!");
      return;
    }
    // Update boardTiles permanently and track it in placedTiles
    setBoardTiles(prev => ({ ...prev, [cellId]: tileData }));
    setPlacedTiles(prev => ([ ...prev, { letter: tileData, position: cellId } ]));
    console.log(`Dropped tile "${tileData}" on cell ${cellId}`);
  };

  // Validate word (using only the newly placed tiles for simplicity)
  // For a more complete game, you might need to combine with existing letters.
  const validateWord = () => {
    if (placedTiles.length === 0) return false;
    const sortedTiles = [...placedTiles].sort((a, b) => a.position.localeCompare(b.position));
    const word = sortedTiles.map(tile => tile.letter).join("").toUpperCase();
    console.log("Validating word:", word);
    return dictionary.includes(word);
  };

  // Submit the word. Returns true if valid, false otherwise.
  const submitWord = () => {
    if (placedTiles.length === 0) {
      alert("No tiles placed!");
      return false;
    }
    if (validateWord()) {
      console.log("Word validated!");
      handleWordPlacement(placedTiles);
      return true;
    } else {
      alert("Invalid word!");
      return false;
    }
  };

  // Process a valid word: update scores and keep boardTiles intact,
  // but clear placedTiles for the next move.
  const handleWordPlacement = (tiles) => {
    const bonusTiles = tiles.map(tile => ({
      letter: tile.letter,
      bonus: bonusSquares[tile.position] || ""
    }));
    const points = calculateScores(bonusTiles);
    if (currentPlayer === 1) {
      setPlayer1Score(prev => prev + points);
    } else {
      setPlayer2Score(prev => prev + points);
    }
    console.log(`Player ${currentPlayer} placed a word! Earned ${points} points.`);
    // Only clear placedTiles so the word remains on the board.
    setTimeout(() => {
      switchTurn();
    }, 1000);
  };

  // Switch turn: clear only placedTiles (keeping permanent boardTiles).
  const switchTurn = () => {
    setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    setPlacedTiles([]);
    setTimeout(() => {
      setTimeLeft(60);
    }, 1500);
  };

  // Build the 15x15 grid
  const rows = [];
  for (let row = 1; row <= boardSize; row++) {
    const cells = [];
    for (let col = 1; col <= boardSize; col++) {
      const cellId = row.toString().padStart(2, "0") + col.toString().padStart(2, "0");
      const bonus = bonusSquares[cellId] || "";
      const bonusText = ["TW", "DW", "TL", "DL"].includes(bonus) ? bonus : "";
      const cellContent = boardTiles[cellId] ? boardTiles[cellId] : bonusText;
      cells.push(
        <td
          key={cellId}
          id={cellId}
          className={bonus}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, cellId)}
          // Allow clicking to remove a tile if it was placed in the current move.
          onClick={() => handleTileClick(cellId)}
        >
          {cellContent}
        </td>
      );
    }
    rows.push(<tr key={row}>{cells}</tr>);
  }

  return (
    <div className="Board">
      <div className="main-section">
        <div className="scoreboard-area">
          <h3 className={`turn-indicator ${timeLeft === 60 ? "turn-change" : ""}`}>
            🎲 It’s{" "}
            <span className={currentPlayer === 1 ? "player1" : "player2"}>
              Player {currentPlayer}
            </span>
            ’s Turn! 🎲
          </h3>
          <ScoreBoard
            player1Score={player1Score}
            player2Score={player2Score}
            currentPlayer={currentPlayer}
            timeLeft={timeLeft}
          />
        </div>
        <div className="board-container">
          <table>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
      <Rack submitWord={submitWord} />
    </div>
  );
};

export default Board;
