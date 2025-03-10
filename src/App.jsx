import React from "react";
import "./App.css";
import Board from "./components/Board";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Scrabble Game</h1>
      </header>
      {/* Only the Board is rendered since it already includes the Rack */}
      <Board />
    </div>
  );
}

export default App;
