// src/App.jsx

import React from "react";
import "./App.css";
import Board from "./components/Board";
import Rack from "./components/Rack";
import TestTilesBag from "./components/TestTilesBag"; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Scrabble Game</h1>
      </header>
      
      <Board />

      <Rack />

      <TestTilesBag />
    </div>
  );
}

export default App;
