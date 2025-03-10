
//function to access the letters in the rack
//returns an array of the letters
function readRack(compRack){
    let result = compRack.map(tile => tile.letter);
    return result;
}

//function to read letters already placed on the board
// and calculate possible word locations
// returns an array of the calculated word positions and their cellsIds
function readBoardStatus(boardTiles){
    let searchPars = boardTiles.map((tile) => {
        let keyLetter = tile.cellData;
        let rowStr = Array.from(tile.cellId).slice(0,2).join("");
        let row = Number(rowStr);
        let colStr = Array.from(tile.cellId).slice(2,4).join("");
        let col = Number(colStr);
        let searchParams = [];
        let par = "?";
        let col1, col2 = col;
        let par1, par2, par3, par4 = par;
        let cells = [tile.cellId];
        let cells1, cells2, cells3, cells4 = cells;
        let row1, row2 = row;


        //horizontal right searchpars
        for(let i = 1; i++; i<7){
            col1 += 1;
            if (col1 > 15) break;
            let index = `${row}${col1}`;
            cells1.push(index);
            let y = boardTiles.filter(t => Number(t.cellId) === Number(index))
            if (y.length === 0) {
                searchParams.push({search: `${keyLetter}${par1}` , cellIds: cells1});
                
                par1 += '?';
            } else {
                par1 += '?';
                break;
            }

        }

        //horizontal left searchpars
        for (let j = 7; j --; j > 0){
            col2 -=1;
            if (col2 <=0) break;
            let index = `${row}${col2}`;
            cells2.unshift(index);
            let y = boardTiles.filter(t => Number(t.cellId) === Number(index));
            if (y.length === 0) {
                searchParams.push({search: `${par2}${keyLetter}` , cellsIds: cells2});
                par2 += '?';
            } else {
                par2 += '?';
                break;
            }
        }

        //vertical down searchpars
        for (let k = 1; k++; k<7){
            row1 += 1;
            if (row1 > 15) break;
            let index = `${row1}${col}`;
            cells3.push(index);
            let y = boardTiles.filter(t => Number(t.cellId) === Number(index));
            if(y === 0) {
                searchParams.push({search: `${keyLetter}${par3}`, cellsIds: cells3});
                par3 += '?';
            } else {
                par3 += '?';
                break;
            }
        }

        //vertical up searchpars
        for (let l = 7; l--; l>0){
            row2 -= 1;
            if(row2 <= 0) break;
            let index = `${row2}${col}`;
            cells4.unshift(index);
            let y = boardTiles.filter(t => Number(t.cellId) === Number(index));
            if (y === 0){
                searchParams.push({search: `${par4}${keyLetter}`, cellsIds: cells4});
                par4 += '?'; 
            } else {
                par4 += '?';
                break;
            }
        }
        return searchParams;
    })
    return searchPars;
}

//function to search words that match the calculated word postions
//takes the array produced by readBoardStatus as a parameter
function generateWords(){
    
}