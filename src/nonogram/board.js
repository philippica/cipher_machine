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

    setByLine(line, len, index, setElement, getCoordinate) {
        let isFinished = true;
        let isChanged = false;
        const changedIndex = [];
        for(let i = 0; i < len; i++) {
            if(line.white[i] === Line.probability.possible) {
                if(this.board[getCoordinate(i, index).x][getCoordinate(i, index).y] === Line.cellStatus.unknown) {
                    setElement(getCoordinate(i, index).x, getCoordinate(i, index).y, Line.cellStatus.white);
                    this.board[getCoordinate(i, index).x][getCoordinate(i, index).y] = Line.cellStatus.white;
                    isChanged = true;
                    changedIndex.push(i);
                }
            } else if(line.black[i] === Line.probability.possible) {
                if(this.board[getCoordinate(i, index).x][getCoordinate(i, index).y] === Line.cellStatus.unknown) {
                    setElement(getCoordinate(i, index).x, getCoordinate(i, index).y, Line.cellStatus.black);
                    this.board[getCoordinate(i, index).x][getCoordinate(i, index).y]= Line.cellStatus.black;
                    isChanged = true;
                    changedIndex.push(i);
                }
            } else {
                isFinished = false;
            }
        }
        return {isFinished, isChanged, changedIndex};
    }

    setRowByLine(line, len, index, setElement) {
        const getCoordinate = (_x, _y) => {
            return {x: _y, y: _x};
        }
        return this.setByLine(line, len, index, setElement, getCoordinate);
    }

    setColumnByLine(line, len, index, setElement) {
        const getCoordinate = (_x, _y) => {
            return {x: _x, y: _y};
        }
        return this.setByLine(line, len, index, setElement, getCoordinate);
    }
}