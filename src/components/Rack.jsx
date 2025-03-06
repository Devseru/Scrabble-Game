import React, { useState } from 'react';
import Tile from './Tile';
import './Rack.css';

const Rack = () => {
  // Sample initial set of tiles. In a full game, these would be drawn from your tile bag.
  const [tiles] = useState([
    { id: 1, letter: 'A', score: 1 },
    { id: 2, letter: 'B', score: 3 },
    { id: 3, letter: 'C', score: 3 },
    { id: 4, letter: 'D', score: 2 },
    { id: 5, letter: 'E', score: 1 },
    { id: 6, letter: 'F', score: 4 },
    { id: 7, letter: 'G', score: 2 },
  ]);

  // Handlers for the control buttons (to be expanded as needed)
  const handleQuit = () => {
    console.log('Quit game');
    // Add quit logic here
  };

  const handleSkip = () => {
    console.log('Skip turn');
    // Add skip turn logic here
  };

  const handleSwap = () => {
    console.log('Swap letters');
    // Add letter swap logic here
  };

  const handleSubmit = () => {
    console.log('Submit move');
    // Add submit move logic here
  };

  // Example handler for when a tile is dragged; expand with react-dnd later.
  const handleDragStart = (tile) => {
    console.log('Started dragging tile:', tile);
  };

  return (
    <div className="rack-container">
      <div className="tile-rack">
        {tiles.map(tile => (
          <Tile
            key={tile.id}
            letter={tile.letter}
            score={tile.score}
            draggable={true}
            onDragStart={() => handleDragStart(tile)}
          />
        ))}
      </div>
      <div className="rack-controls">
        <button onClick={handleQuit}>Quit</button>
        <button onClick={handleSkip}>Skip</button>
        <button onClick={handleSwap}>Swap Letters</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Rack;
