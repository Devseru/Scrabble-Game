import React from "react";
import "./css/Board.css"

const Board = () => {
    const boardSize = 15;

    const createBoard = () => {
        const tiles = [];
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) { 
                tiles.push(
                    <div
                        key={`${row}-${col}`} 
                        className="tile" 
                        data-row={row} 
                        data-col={col}>
                    </div>
                );
            }
        }
        return tiles;
    };
    
    return <div 
        className="board">
        {createBoard()}
        </div>;
}

export default Board;