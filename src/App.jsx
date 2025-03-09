import React, {useState, useEffect} from "react";
import "./App.css";
import Board from "./components/Board";
import { validateWord } from "./Logic/WordValidation";

function App() {
  // testing WordValidation
  const [message, setMessage] = useState("");
  const [word, setWord] = useState("branch");
  useEffect(() => {
    setWord("text");
    setMessage(validateWord(word));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Scrabble Game</h1>
      </header>
      {/* Only the Board is rendered since it already includes the Rack */}
      <Board />
      <p>{message}</p>
    </div>
  );
}

export default App;
