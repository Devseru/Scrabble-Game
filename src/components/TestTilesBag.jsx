// TestTilesBag.jsx
import React from 'react';
import { getInitialTilesBag, drawTiles } from '../Logic/TilesBag'; 
// Adjust path as needed

function TestTilesBag() {
  const handleClick = () => {
    const bag = getInitialTilesBag();
    console.log('Initial bag size:', bag.length);

    const drawnTiles = drawTiles(7, bag);
    console.log('Drawn tiles:', drawnTiles);
    console.log('Remaining bag size:', bag.length);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={handleClick}>Test Tiles Bag</button>
    </div>
  );
}

export default TestTilesBag;
