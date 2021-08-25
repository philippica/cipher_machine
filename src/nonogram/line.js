export class Line {
    static cellStatus = {
        unknown: 0,
        black: 1,
        white: 2,
    };
    static probability = {
        possible: 0,
        impossible: 1,
    }
    constructor(proprety, index, numbers) {
        this._line = [];
        this.proprety = proprety;
        this.index = index;
        this.numbers = numbers;
    }
    get line() {
        return this._line;
    }
    push(item) {
        this._line.push(item);
    }
    fill(line, start, fillLength) {
        if(start+fillLength-1 >= line.length) {
            return false;
        }
        for(let i = 0; i < fillLength; i++) {
            if(line[start+i] === Line.cellStatus.white) {
                return false;
            }
        }
        if(line[start + fillLength] === Line.cellStatus.black) {
            return false;
        }
        for(let i = 0; i < fillLength; i++) {
            line[start+i] = Line.cellStatus.black; 
        }
        return true;
    }
    update(line) {
        for(let i = 0; i < line.length; i++) {
            if(line[i] === Line.cellStatus.white) {
                this.black[i] = Line.probability.impossible;
            } else if(line[i] === Line.cellStatus.black) {
                this.white[i] = Line.probability.impossible;
            }
        }
    }

    dfs(currentPosition, len, line, leftSpaces) {
        if(this.numbers.length === 0) {
            for(let i = currentPosition; i < len; i++) {
                if(line[i] === Line.cellStatus.black) {
                    return;
                }
            }
            for(let i = 0; i < len; i++) {
                if(line[i] === Line.cellStatus.unknown) {
                    line[i] = Line.cellStatus.white;
                }
            }
            this.update(line, this.white);
            return;
        }
        const number = this.numbers.pop();
        const leftSpace = leftSpaces.pop();
        for(let i = currentPosition; i < line.length; i++) {
            const dummmyLine = line.slice(0);
            if(this.fill(dummmyLine, i, number)) {
                this.dfs(i + number + 1, len, dummmyLine, leftSpaces);
            }
            if(line[i] === Line.cellStatus.black) {
                break;
            }
        }
        this.numbers.push(number);
        leftSpaces.push(leftSpace);
    }
    calculate() {
        const len = this._line.length;
        const leftSpace = this.numbers.slice(0);
        for(let i = 1; i < this.numbers.length; i++) {
            leftSpace[i] += leftSpace[i-1] + 1;
        }
        this.white = [];
        this.black = [];
        for(let i = 0; i < len; i++) {
            this.white.push(Line.probability.possible);
            this.black.push(Line.probability.possible);
        }
        this.dfs(0, len, this._line.slice(0), this.numbers.slice(0), leftSpace);
    }

}