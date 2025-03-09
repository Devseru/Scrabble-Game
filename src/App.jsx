import React from "react";
import "./App.css";
import Board from "./components/Board";
import { GameProvider } from "./context/GameContext"; 

function App() {
  return (
    <GameProvider>
      <div className="App">
        <header className="App-header">
          <h1>Scrabble Game</h1>
        </header>
        {/* Only the Board is rendered since it already includes the Rack */}
        <Board />
      </div>
    </GameProvider>
  );
}

export default App;
