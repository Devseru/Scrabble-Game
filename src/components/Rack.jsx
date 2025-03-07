import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import './Rack.css';
import { getInitialTilesBag, drawTiles } from '../Logic/TilesBag';

const Rack = ({ submitWord }) => {
  const [bag, setBag] = useState([]);
  const [tiles, setTiles] = useState([]);
  // Track IDs of tiles that have been played (i.e. dragged from the rack)
  const [usedTileIds, setUsedTileIds] = useState([]);

  // On component mount, initialize the bag and draw 7 tiles for the rack.
  useEffect(() => {
    const initialBag = getInitialTilesBag();
    const initialTiles = drawTiles(7, initialBag); // Draw 7 tiles
    setBag(initialBag); // Save remaining bag for future use
    setTiles(initialTiles);
  }, []);

  // Quit: Reload the page to simulate quitting the game.
  const handleQuit = () => {
    console.log('Quitting game');
    window.location.reload();
  };

  // Skip: Log the skip action (rack remains unchanged).
  const handleSkip = () => {
    console.log('Skipping turn (rack remains the same)');
    // Optionally, add additional skip logic here.
  };

  // Swap Letters: Return current tiles to the bag and draw new tiles equal to the rack length.
  const handleSwap = () => {
    console.log('Swapping letters');
    // Combine current rack with the remaining bag, then draw new tiles equal to the rack length.
    const combinedBag = [...bag, ...tiles];
    const newTiles = drawTiles(tiles.length, combinedBag);
    setBag(combinedBag); // Update bag with remaining tiles after drawing
    setTiles(newTiles);
    // Clear the used tile tracking.
    setUsedTileIds([]);
  };

  // Submit: Call the submitWord function passed from Board.
  // Only update the rack if the submitted word is valid.
  const handleSubmit = () => {
    console.log('Submitting move from Rack');
    if (submitWord) {
      const valid = submitWord();
      if (valid) {
        // Remove tiles that were used (dragged out) from the rack.
        const remainingTiles = tiles.filter(tile => !usedTileIds.includes(tile.id));
        // Determine how many new tiles are needed to fill the rack back to 7.
        const numTilesToDraw = 7 - remainingTiles.length;
        // Draw new tiles from the bag.
        const newTiles = drawTiles(numTilesToDraw, bag);
        // Update the rack: keep the remaining tiles and add the newly drawn ones.
        setTiles([...remainingTiles, ...newTiles]);
        // Clear the usedTileIds tracking.
        setUsedTileIds([]);
      }
    }
  };

  // When a tile starts being dragged, mark it as used.
  const handleDragStart = (tile) => {
    console.log('Started dragging tile:', tile);
    if (!usedTileIds.includes(tile.id)) {
      setUsedTileIds(prev => [...prev, tile.id]);
    }
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
