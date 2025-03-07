//letter scores based on scrabble rules
const tileScores ={
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
  J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
  S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10, " ": 0
};

/** function to calculate the score for a placed word
 * @param {Array} tiles - function expects an array of tile objects [{letter, bonus}]
 * @returns {number} - function expects that the functions returns a number-total score
 */

export function calculateScores(tiles){
    let score=0;
    let wordMultiplier =1;//this keeps track of word score multipliers

    tiles.forEach(({letter,bonus}) => {
        let tileScore = tileScores[letter.toUpperCase()] || 0;//gets the score for the letter
        //tiles wiht bonus scores
        if (bonus === "DL"){
            tileScore*=2;//double letter score
        } else if(bonus === "TL"){
            tileScore*=3;//tripple letter score
        } else if(bonus === "DW"){
            wordMultiplier*=3;// double word score
        } else if(bonus === "TW"){
            wordMultiplier*=3;//tripple word score
        }
        score +=tileScore;//add the tile score total
    });
    return score*wordMultiplier;
}