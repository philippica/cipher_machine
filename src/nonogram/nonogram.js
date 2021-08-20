import { Board } from './board';


export class Nonogram {
	constructor() {
	}

	solveLine(len, numberList) {

	}

	nonogramSolver(columnArea, rowArea) {
		const row = this.row = rowArea.length;
		const col = this.column = columnArea.length;
		this.board = new Board(row, column);

		for(let i = 0; i < row; i++) {
			this.solveLine(col, rowArea[i])
		}

		for(let i = 0; i < col; i++) {
			this.solveLine(row, columnArea[i])
		}

	}

}




