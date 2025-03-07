import React, { useState, useEffect } from "react";
import "../css/Board.css";
import ScoreBoard from "./ScoreBoard";
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
  "1014": "TL", "1105": "DW","1111": "DW",  "1201": "DL", "1204": "DW",
  "1208": "DL", "1212": "DW", "1215": "DL", "1303": "DW", "1307": "DL",
  "1309": "DL", "1313": "DW", "1402": "DW", "1406": "TL", "1410": "TL",
  "1414": "DW", "1501": "TW", "1504": "DL", "1512": "DL", "1515": "TW",
};

const Board = () => {
  const boardSize = 15;
  // Existing state for scores, turn and timer
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1); // player 1 starts
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per turn

  // New state for managing placed tiles on the board
  // boardTiles maps cellId to the letter dropped there
  const [boardTiles, setBoardTiles] = useState({});
  // placedTiles is an array of objects with letter and cell position
  const [placedTiles, setPlacedTiles] = useState([]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      console.log(`Player ${currentPlayer} ran out of time! Switching turns.`);
      setTimeout(() => {
        switchTurn();
      }, 1000);
      return;
    }
  
    const timer = setInterval(() => {
      setTimeLeft(last => last - 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  // Switch turn and clear placed tiles for new move
  const switchTurn = () => {
    setCurrentPlayer(prev => {
      const nextPlayer = prev === 1 ? 2 : 1;
      console.log(`It's now Player ${nextPlayer}'s turn!`);
      return nextPlayer;
    });
    // Clear placed tiles for the next turn
    setBoardTiles({});
    setPlacedTiles([]);
    setTimeout(() => {
      setTimeLeft(60);
    }, 1500);
  };

  // Function to handle when a tile is dropped on a cell
  const handleDrop = (e, cellId) => {
    e.preventDefault();
    const tileData = e.dataTransfer.getData("tile"); // Expecting the tile's letter
    if (!tileData) return;
    // Prevent overriding a tile in a cell
    if (boardTiles[cellId]) {
      alert("This cell already has a tile!");
      return;
    }
    // Record the dropped tile in both boardTiles and placedTiles
    setBoardTiles(prev => ({ ...prev, [cellId]: tileData }));
    setPlacedTiles(prev => ([ ...prev, { letter: tileData, position: cellId } ]));
    console.log(`Dropped tile "${tileData}" on cell ${cellId}`);
  };

  // Placeholder function for word validation (to be replaced with dictionary lookup)
  const validateWord = (tiles) => {
    // Combine letters as needed and validate against a dictionary.
    // For now, we'll assume the word is always valid.
    return true;
  };

  // Function to submit the word that has been placed
  const submitWord = () => {
    if (placedTiles.length === 0) {
      alert("No tiles placed!");
      return;
    }
    if (validateWord(placedTiles)) {
      console.log("Word validated!");
      handleWordPlacement(placedTiles);
    } else {
      alert("Invalid word!");
      // Optionally, clear placed tiles if the word is invalid.
    }
  };

  // Existing function that calculates the score for the placed word and switches turn
  const handleWordPlacement = (tiles) => {
    const bonusTiles = tiles.map(tile => ({
      letter: tile.letter,
      bonus: bonusSquares[tile.position] || ""
    }));
  
    const points = calculateScores(bonusTiles);
  
    if (currentPlayer === 1) {
      setPlayer1Score(last => last + points);
    } else {
      setPlayer2Score(last => last + points);
    }
  
    console.log(`Player ${currentPlayer} placed a word! Earned ${points} points.`);
    
    // Switch turn after a slight delay
    setTimeout(() => {
      switchTurn();
    }, 1000);
  };

  // Render the 15x15 grid with drag-and-drop event handlers
  const rows = [];
  for (let row = 1; row <= boardSize; row++) {
    const cells = [];
    for (let col = 1; col <= boardSize; col++) {
      const cellId = row.toString().padStart(2, "0") + col.toString().padStart(2, "0");
      const bonus = bonusSquares[cellId] || "";
      // For bonus cells, show bonus text unless a tile has been dropped here
      const bonusText = ["TW", "DW", "TL", "DL"].includes(bonus) ? bonus : "";
      const cellContent = boardTiles[cellId] ? boardTiles[cellId] : bonusText;
      cells.push(
        <td 
          key={cellId} 
          id={cellId} 
          className={bonus}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, cellId)}
        >
          {cellContent}
        </td>
      );
    }
    rows.push(<tr key={row}>{cells}</tr>);
  }

  return (
    <div className="Board">
      <div className="scoreboard-container">
        <h3 className={`turn-indicator ${timeLeft === 60 ? "turn-change" : ""}`}>
          🎲 It’s <span className={currentPlayer === 1 ? "player1" : "player2"}>
          Player {currentPlayer}</span>’s Turn! 🎲
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
  
      {/* Button to submit the placed word */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={submitWord}>Submit Word</button>
      </div>
    </div>
  );
};

export default Board;
