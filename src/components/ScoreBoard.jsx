import React from "react";
import "../css/ScoreBoard.css";


const ScoreBoard =({score}) => {
    return(
        <div className="scoreboard">
            <h2>ScoreBoard</h2>
            <p>Player Score: {score} points</p>
        </div>
    );
};

export default ScoreBoard;