import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import './Rack.css';
import { getInitialTilesBag, drawTiles } from '../Logic/TilesBag';

const Rack = () => {
  const [bag, setBag] = useState([]);
  const [tiles, setTiles] = useState([]);

  // On component mount, initialize the bag and draw 7 tiles for the rack.
  useEffect(() => {
    const initialBag = getInitialTilesBag();
    const initialTiles = drawTiles(7, initialBag); // Draw 7 tiles
    setBag(initialBag); // Save remaining bag (for future use)
    setTiles(initialTiles);
  }, []);

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
