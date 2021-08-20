export class Board {
    static unknown = 0;
    static black = 1;
    static white = 2;
    constructor(row, column) {
        this.board = [];
        for(let i = 0; i <= row; i++) {
            const line = [];
            for(let j = 0; j < column; j++) {
                line.push(this.unknown);
            }
            this.board.push(line);
        }
    }
}