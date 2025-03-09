import React, { createContext, useState } from "react";

const GameContext = createContext();

const initializeBoard = () => {
  return Array(15).fill(null).map(() => Array(15).fill(null));
};

const initializePlayers = () => {
  return [
    { id: 0, name: "Player 1", score: 0, rack: [] },
    { id: 1, name: "Player 2", score: 0, rack: [] },
  ];
};

const GameProvider = ({ children }) => {
  const [board, setBoard] = useState(initializeBoard());
  const [players, setPlayers] = useState(initializePlayers());
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [bag] = useState([]);

  const checkGameOver = () => {
    const allTilesUsed = players.some(player => player.rack.length === 0);
    const noMoreMoves = bag.length === 0 && players.every(player => player.rack.length === 0);
    
    if (allTilesUsed || noMoreMoves) {
      setGameOver(true);
      const winner = determineWinner();
      alert(`Game Over! 🎉 The winner is ${winner.name} with ${winner.score} points!`);
      return true;
    }
    return false;
  };

  const nextTurn = () => {
    if (checkGameOver()) return;
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const updateScore = (playerIndex, points) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) =>
        index === playerIndex ? { ...player, score: player.score + points } : player
      )
    );
  };

  const recordMove = (word, position, score) => {
    setGameHistory((prevHistory) => [
      ...prevHistory,
      { player: players[currentPlayerIndex].name, word, position, score }
    ]);
    updateScore(currentPlayerIndex, score);
    nextTurn();
  };

  const determineWinner = () => {
    return players.reduce((highest, player) => (player.score > highest.score ? player : highest));
  };

  return (
    <GameContext.Provider
      value={{
        board,
        setBoard,
        players,
        currentPlayerIndex,
        gameHistory,
        gameOver,
        setGameHistory,
        nextTurn,
        recordMove,
        determineWinner,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
