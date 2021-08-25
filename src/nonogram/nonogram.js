import { Board } from './board';


export class Nonogram {
	constructor() {
	}

	solveLine(type, index, setRowByLine) {
		const line = this.board.getLine(type, index, this.number[type][index]);
		line.calculate();
		return this.setLineMethod[type](line, this.number[type^1].length, index, setRowByLine);
	}

	init(columnArea, rowArea) {
		this.number = [];
		this.number[Board.linePropety.row] = rowArea;
		this.number[Board.linePropety.column] = columnArea;
		const row = this.row = rowArea.length;
		const col = this.column = columnArea.length;
		this.board = new Board(row, col);
		this.setLineMethod = [];
		this.setLineMethod[Board.linePropety.row] = this.board.setRowByLine.bind(this.board);
		this.setLineMethod[Board.linePropety.column] = this.board.setColumnByLine.bind(this.board);
	}

	nonogramSolver(columnArea, rowArea, setRowByLine) {
		this.init(columnArea, rowArea, setRowByLine);
		if(!setRowByLine) {
			setRowByLine = ()=>{};
		}
		const row = this.row;
		const col = this.column;

		const isFinishedRow = [];
		const isFinishedCol = [];
		const isChangedRow = new Set();
		const isChangedCol = new Set();

		for(let i = 0; i < row; i++) {
			const { isFinished, isChanged } = this.solveLine(Board.linePropety.row, i, setRowByLine);
			isFinishedRow.push(isFinished);
		}

		for(let i = 0; i < col; i++) {
			const { isFinished, isChanged, changedIndex } = this.solveLine(Board.linePropety.column, i, setRowByLine);
			isFinishedCol.push(isFinished);
			for(let index of changedIndex) {
				if(isFinishedRow[index])continue;
				isChangedRow.add(index);
			}
		}

		while(isChangedRow.size > 0) {
			for(let index of isChangedRow) {
				isChangedRow.delete(index);
				const { isFinished, isChanged, changedIndex } = this.solveLine(Board.linePropety.row, index, setRowByLine);
				isFinishedRow[index] = isFinished;
				for(let index of changedIndex) {
					if(isFinishedCol[index])continue;
					isChangedCol.add(index);
				}
			}
			for(let index of isChangedCol) {
				isChangedCol.delete(index);
				const { isFinished, isChanged, changedIndex } = this.solveLine(Board.linePropety.column, index, setRowByLine);
				isFinishedCol[index] = isFinished;
				for(let index of changedIndex) {
					if(isFinishedRow[index])continue;
					isChangedRow.add(index);
				}
			}
		}
	}

}




