// src/logic/TilesBag.js

// Define the tile distribution based on Scrabble rules
const tileDistribution = [
    { letter: "A", score: 1, count: 9 },
    { letter: "B", score: 3, count: 2 },
    { letter: "C", score: 3, count: 2 },
    { letter: "D", score: 2, count: 4 },
    { letter: "E", score: 1, count: 12 },
    { letter: "F", score: 4, count: 2 },
    { letter: "G", score: 2, count: 3 },
    { letter: "H", score: 4, count: 2 },
    { letter: "I", score: 1, count: 9 },
    { letter: "J", score: 8, count: 1 },
    { letter: "K", score: 5, count: 1 },
    { letter: "L", score: 1, count: 4 },
    { letter: "M", score: 3, count: 2 },
    { letter: "N", score: 1, count: 6 },
    { letter: "O", score: 1, count: 8 },
    { letter: "P", score: 3, count: 2 },
    { letter: "Q", score: 10, count: 1 },
    { letter: "R", score: 1, count: 6 },
    { letter: "S", score: 1, count: 4 },
    { letter: "T", score: 1, count: 6 },
    { letter: "U", score: 1, count: 4 },
    { letter: "V", score: 4, count: 2 },
    { letter: "W", score: 4, count: 2 },
    { letter: "X", score: 8, count: 1 },
    { letter: "Y", score: 4, count: 2 },
    { letter: "Z", score: 10, count: 1 },
    { letter: " ", score: 0, count: 2 } // blank tiles
  ];
  
  /**
   * Generates the initial bag of tiles.
   * Each tile is represented as an object with a unique id, letter, and score.
   */
  function getInitialTilesBag() {
    const bag = [];
    tileDistribution.forEach(tile => {
      for (let i = 0; i < tile.count; i++) {
        bag.push({
          id: `${tile.letter}-${i}-${Math.random()}`, // Create a unique id
          letter: tile.letter,
          score: tile.score,
        });
      }
    });
    return bag;
  }
  
  /**
   * Draws a specified number of tiles randomly from the bag.
   * The drawn tiles are removed from the bag.
   * 
   * @param {number} count - Number of tiles to draw.
   * @param {Array} bag - The current bag of tiles.
   * @returns {Array} - Array of drawn tile objects.
   */
  function drawTiles(count, bag) {
    const drawnTiles = [];
    for (let i = 0; i < count; i++) {
      if (bag.length === 0) break; // No more tiles to draw
      const index = Math.floor(Math.random() * bag.length);
      drawnTiles.push(bag[index]);
      bag.splice(index, 1); // Remove the drawn tile from the bag
    }
    return drawnTiles;
  }
  
  export { getInitialTilesBag, drawTiles };
  