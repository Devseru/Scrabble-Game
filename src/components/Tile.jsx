import React from 'react';
import './Tile.css'; // Make sure to create and import your CSS for styling

const Tile = ({ letter, score, draggable = false, onDragStart, onDragEnd }) => {
  // Handler for drag start: here we set the letter as data using the key "tile"
  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(letter);
    }
    e.dataTransfer.setData("tile", letter); // Updated key to "tile"
  };

  return (
    <div
      className="tile"
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <span className="tile-letter">{letter}</span>
      <span className="tile-score">{score}</span>
    </div>
  );
};

export default Tile;