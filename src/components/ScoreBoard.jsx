import React from "react";
import "../css/ScoreBoard.css";


const ScoreBoard =({player1Score, player2Score, currentPlayer, timeLeft}) => {
    return(
        <div className="scoreboard">
            <h2>ScoreBoard</h2>
            <p>
                <strong>Player 1:</strong> {player1Score} points
            </p>
            <p>
                <strong>Player 2:</strong> {player2Score} points
            </p>
            <p>
                <strong>Current Turn:</strong> {currentPlayer === 1 ? "Player 1" : "Player 2"}
            </p>
            <p className={`timer ${timeLeft < 10 ? "warning" : ""}`}>
                <strong>Time Left:</strong> {timeLeft}s
            </p>
        </div>
    );
};

export default ScoreBoard;