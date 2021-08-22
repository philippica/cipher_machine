import { Line } from "./line";

export class Board {
    static linePropety = {
        row: 0,
        column: 1,
    };
    constructor(row, column) {
        this.board = [];
        this.row = row;
        this.column = column;
        for(let i = 0; i <= row; i++) {
            const line = [];
            for(let j = 0; j < column; j++) {
                line.push(Line.cellStatus.unknown);
            }
            this.board.push(line);
        }
    }

    getLine(propety, index, numbers) {
        const line = new Line(propety, index, numbers);
        if(propety === Board.linePropety.row) {
            for(let i = 0; i < this.column; i++) {
                line.push(this.board[index][i]);
            }
        } else {
            for(let i = 0; i < this.row; i++) {
                line.push(this.board[i][index]);
            }
        }
        return line;
    }

    setRowByLine(line, len, index, setElement) {
        for(let i = 0; i < len; i++) {
            if(line.white[i] === Line.probability.possible) {
                if(this.board[index][i] === Line.cellStatus.unknown) {
                    setElement(index, i, Line.cellStatus.white);
                    this.board[index][i] = Line.cellStatus.white;
                }
            }
            if(line.black[i] === Line.probability.possible) {
                if(this.board[index][i] === Line.cellStatus.unknown) {
                    setElement(index, i, Line.cellStatus.black);
                    this.board[index][i] = Line.cellStatus.black;
                }
            }
        }
    }

    setColumnByLine(line, len, index, setElement) {
        for(let i = 0; i < len; i++) {
            if(line.white[i] === Line.probability.possible) {
                if(this.board[i][index] === Line.cellStatus.unknown) {
                    setElement(i, index, Line.cellStatus.white);
                    this.board[i][index] = Line.cellStatus.white;
                }
            }
            if(line.black[i] === Line.probability.possible) {
                if(this.board[i][index] === Line.cellStatus.unknown) {
                    setElement(i, index, Line.cellStatus.black);
                    this.board[i][index] = Line.cellStatus.black;
                }
            }
        }
    }
}