import React, { createContext, useState } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [board, setBoard] = useState(initializeBoard());
  const [scores, setScores] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [playerRacks, setPlayerRacks] = useState([/* initial racks */]);

  return (
    <GameContext.Provider value={{ board, scores, currentPlayer, gameHistory, playerRacks, setBoard, setScores, setCurrentPlayer, setGameHistory, setPlayerRacks }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };