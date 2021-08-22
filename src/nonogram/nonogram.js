import { Board } from './board';


export class Nonogram {
	constructor() {
	}

	solveLine(len, numberList) {

	}

	nonogramSolver(columnArea, rowArea, setRowByLine) {
		if(!setRowByLine) {
			setRowByLine = ()=>{};
		}
		const row = this.row = rowArea.length;
		const col = this.column = columnArea.length;
		this.board = new Board(row, col);

		for(let i = 0; i < row; i++) {
			const line = this.board.getLine(Board.linePropety.row, i, rowArea[i]);
			line.calculate();
			this.board.setRowByLine(line, col, i, setRowByLine);
			this.solveLine(col, rowArea[i])
		}

		for(let i = 0; i < col; i++) {
			const line = this.board.getLine(Board.linePropety.column, i, columnArea[i]);
			line.calculate();
			this.board.setColumnByLine(line, row, i, setRowByLine);
			this.solveLine(row, columnArea[i])
		}

	}

}




