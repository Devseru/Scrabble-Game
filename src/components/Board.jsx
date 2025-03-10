import React, { useState, useEffect, createContext } from "react";
import "../css/Board.css";
import "../css/ScoreBoard.css";
import ScoreBoard from "./ScoreBoard";
import Rack from "./Rack";
import { calculateScores } from "../Logic/Scoring"; 
import { isValidWord } from "../Logic/GamesRules"; 
import { validateWordFn } from "../Logic/WordValidation";

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

//context to provide the state of the two racks across various components
export const RackContext =  createContext("none");

const Board = () => {
  const boardSize = 15;

  //state containing the letters in the two racks
  //player1's rack and the computer's rack
  const[player1Rack, setPlayer1Rack] = useState([]);
  const [compRack, setCompRack] = useState([]); 

  // State for scores, turn, timer
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1); 
  const [timeLeft, setTimeLeft] = useState(60);

  // boardTiles holds the permanent letters on the board;
  // placedTiles holds the letters placed during the current move.
  const [boardTiles, setBoardTiles] = useState({});
  const [placedTiles, setPlacedTiles] = useState([]);

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

  // Removed auto-scoring useEffect that updated score on placedTiles change.
  // Scoring will now only happen when submitWord calls handleWordPlacement.

  // Click handler to remove a tile placed in the current move.
  const handleTileClick = (cellId) => {
    const tileInCurrentMove = placedTiles.find(tile => tile.position === cellId);
    if (!tileInCurrentMove) return;
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
    if (boardTiles[cellId]) {
      alert("This cell already has a tile!");
      return;
    }
    setBoardTiles(prev => ({ ...prev, [cellId]: tileData }));
    setPlacedTiles(prev => ([ ...prev, { letter: tileData, position: cellId } ]));
  };

  // Helper to build the full horizontal word from the board at a given row.
  const getFullWordHorizontal = (row) => {
    const cols = placedTiles.map(tile => parseInt(tile.position.slice(2, 4)));
    let minCol = Math.min(...cols);
    let maxCol = Math.max(...cols);
    let start = minCol;
    while (start > 1) {
      const cellId = row.toString().padStart(2, "0") + (start - 1).toString().padStart(2, "0");
      if (boardTiles[cellId]) {
        start--;
      } else {
        break;
      }
    }
    let end = maxCol;
    while (end < boardSize) {
      const cellId = row.toString().padStart(2, "0") + (end + 1).toString().padStart(2, "0");
      if (boardTiles[cellId]) {
        end++;
      } else {
        break;
      }
    }
    let fullWord = "";
    for (let c = start; c <= end; c++) {
      const cellId = row.toString().padStart(2, "0") + c.toString().padStart(2, "0");
      fullWord += boardTiles[cellId] || "";
    }
    return fullWord;
  };

  // Helper to build the full vertical word from the board at a given column.
  const getFullWordVertical = (col) => {
    const rowsArr = placedTiles.map(tile => parseInt(tile.position.slice(0, 2)));
    let minRow = Math.min(...rowsArr);
    let maxRow = Math.max(...rowsArr);
    let start = minRow;
    while (start > 1) {
      const cellId = start.toString().padStart(2, "0") + col.toString().padStart(2, "0");
      if (boardTiles[cellId]) {
        start--;
      } else {
        break;
      }
    }
    let end = maxRow;
    while (end < boardSize) {
      const cellId = end.toString().padStart(2, "0") + col.toString().padStart(2, "0");
      if (boardTiles[cellId]) {
        end++;
      } else {
        break;
      }
    }
    let fullWord = "";
    for (let r = start; r <= end; r++) {
      const cellId = r.toString().padStart(2, "0") + col.toString().padStart(2, "0");
      fullWord += boardTiles[cellId] || "";
    }
    return fullWord;
  };

  // Validate word by forming the full word (including adjacent letters on the board)
  // and then checking it with the API.
  const validateWord = async () => {
    if (placedTiles.length === 0) return false;
    let fullWord = "";
    const rowsArr = placedTiles.map(tile => tile.position.slice(0, 2));
    const isHorizontal = rowsArr.every(r => r === rowsArr[0]);
    if (isHorizontal) {
      const row = parseInt(rowsArr[0]);
      fullWord = getFullWordHorizontal(row);
    } else {
      const colsArr = placedTiles.map(tile => tile.position.slice(2, 4));
      const isVertical = colsArr.every(c => c === colsArr[0]);
      if (isVertical) {
        const col = parseInt(colsArr[0]);
        fullWord = getFullWordVertical(col);
      } else {
        // For non-linear placements, we can't form a proper word.
        return false;
      }
    }
    fullWord = fullWord.trim();
    console.log("Validating full word:", fullWord);
    if (fullWord.length < 2) return false;
    return await isValidWord(fullWord.toLowerCase());
  };

  // Submit the word. Returns true if valid, false otherwise.
  const submitWord = async () => {
    if (placedTiles.length === 0) {
      alert("No tiles placed!");
      return false;
    }
    if (await validateWord()) {
      console.log("Word validated!");
      console.log(validateResult);
      handleWordPlacement(placedTiles);
      return true;
    } else {
      alert("Invalid word!");
      return false;
    }};

  // Process a valid word: update scores and clear placed tiles.
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
    setTimeout(() => {
      switchTurn();
    }, 1000);
  };

  // Switch turn: clear only placed tiles.
  const switchTurn = () => {
    setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    setPlacedTiles([]);
    setTimeout(() => {
      setTimeLeft(60);
    }, 1500);
  };

  //give names to the the two players
  let player1 = "player 1";
  let player2 = "computer";

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
          onClick={() => handleTileClick(cellId)}
        >
          {cellContent}
        </td>
      );
    }
    rows.push(<tr key={row}>{cells}</tr>);
  }

  //console.log(player1Rack);
  //console.log(compRack);
  return (
    <RackContext.Provider value = {{player1Rack, setPlayer1Rack, compRack, setCompRack}}>
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
        {currentPlayer === 1 ? <Rack submitWord={submitWord} player = {player1} /> :
        <Rack submitWord={submitWord} player = {player2}/>}
      </div>
    </RackContext.Provider>
  );
};

export default Board;
