import React from "react";

const GameHistory = ({ history }) => {
  return (
    <div className="game-history">
      <h3>Game History</h3>
      {history.length === 0 ? (
        <p>No moves have been made yet.</p>
      ) : (
        <ul>
          {history.map((move, index) => (
            <li key={index}>
              <strong>Player {move.player + 1}:</strong> Placed "{move.word}" at ({move.position.row}, {move.position.col}) for {move.points} points.
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameHistory;