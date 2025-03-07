import React, {useState, useEffect} from "react";
import "../css/Board.css";
import ScoreBoard from "./ScoreBoard";
import { calculateScores } from "../Logic/Scoring"; 

// Example bonus squares mapping (with "1409": "TL" removed)
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
  //tracking player's score
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1); //player 1 starts
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per turn

  //the timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      console.log(`Player ${currentPlayer} ran out of time! Switching turns.`);
      
      // Wait 1 second before switching the turn to ensure UI updates
      setTimeout(() => {
        switchTurn();
      }, 1000);
      return; //stop execution here
    }
  
    const timer = setInterval(() => {
      setTimeLeft(last => last - 1);
    }, 1000);
  
    return () => clearInterval(timer); // Cleanup
  }, [timeLeft]); 
  
  //switching turn logic
  const switchTurn = () => {
    setCurrentPlayer(prev => {
      const nextPlayer = prev === 1 ? 2 : 1;
      console.log(`It's now Player ${nextPlayer}'s turn!`);
      return nextPlayer;
    });
  
    //Don't reset the timer immediately
    setTimeout(() => {
      setTimeLeft(60);
    }, 1500); // Small delay to allow UI updates before timer resets
  };
  


  const handleWordPlacement = (placedTiles) => {
    const bonusTiles = placedTiles.map(tile => ({
      letter: tile.letter,
      bonus: bonusSquares[tile.position] || "" // Get bonus type or empty string
    }));
  
    const points = calculateScores(bonusTiles);
  
    if (currentPlayer === 1) {
      setPlayer1Score(last => last + points);
    } else {
      setPlayer2Score(last => last + points);
    }
  
    console.log(`Player ${currentPlayer} placed a word! Earned ${points} points.`);
    
    // Add a slight delay to ensure the turn switches before resetting the timer
    setTimeout(() => {
      switchTurn();
    }, 1000);
  };
  
  

  const rows = [];
  for (let row = 1; row <= boardSize; row++) {
    const cells = [];
    for (let col = 1; col <= boardSize; col++) {
      // Create a unique cell ID: "0101" for row=1,col=1
      const cellId = row.toString().padStart(2, "0") + col.toString().padStart(2, "0");
      const bonus = bonusSquares[cellId] || "";
      
      // We only display text for standard bonus labels (TW, DW, TL, DL)
      // If it's "centerTile" or anything else, we show no text
      const cellText = ["TW", "DW", "TL", "DL"].includes(bonus) ? bonus : "";

      cells.push(
        <td key={cellId} id={cellId} className={bonus}>
          {cellText}
        </td>
      );
    }
    rows.push(<tr key={row}>{cells}</tr>);
  }

  return (
    <div className="Board">
      {/* ✅ Wrap Scoreboard & Turn Indicator in a div for better alignment */}
      <div className="scoreboard-container">
        {/* ✅ Turn Indicator - Shows who is playing */}
        <h3 className={`turn-indicator ${timeLeft === 60 ? "turn-change" : ""}`}>
          🎲 It’s <span className={currentPlayer === 1 ? "player1" : "player2"}>
          Player {currentPlayer}</span>’s Turn! 🎲
        </h3>
  
        {/* ✅ Scoreboard (Now Below Turn Indicator) */}
        <ScoreBoard
          player1Score={player1Score} 
          player2Score={player2Score} 
          currentPlayer={currentPlayer}
          timeLeft={timeLeft}
        />
      </div>
  
      {/* Game Board */}
      <div className="board-container">
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
  
};

export default Board;
