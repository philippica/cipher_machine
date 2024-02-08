import { Trie } from "../common/Trie";

//import { words } from "../common/dict";
export class WordSearch {
    constructor() {
    }
    
    customWordList(wordList) {
        this.customTrie = new Trie();
        for(let word of wordList) {
            if(!this.Trie.contains(word)) {
                customTrie.insert(word);
            }
        }
    }
    contains(str) {
        let currentNode = this.root;
        for(let i = 0; i < str.length; i++) {
            if(!currentNode[str[i]]) {
                return false;
            }
            currentNode = currentNode[str[i]];
        }
        return currentNode.isWord;
    }
    search(x, y, dx, dy, filter) {
        let currentX = x;
        let currentY = y;
        let str = "";
        while(currentX < this.row && currentX >= 0 && currentY < this.column && currentY >= 0) {
            str += this.matrix[currentX][currentY];
            currentX += dx;
            currentY += dy;
        }
        const answers = window.Trie.findAll(str).filter((word)=>word.length>=2).map((word)=> {
            return {word, x, y, dx, dy};
        });
        return answers;
    }
    wordSearch(matrix, filter) {
        if(!filter) {
            filter = {
                length: 3,
            }
        }
        const dx = [-1,0,1,-1,1,-1,0,1];
        const dy = [1,1,1,0,0,-1,-1,-1];
        this.matrix = matrix;
        const answers = [];
        const row = this.row = matrix.length;
        const column = this.column = matrix[0].length;
        for(let i = 0; i < row; i++) {
            for(let j = 0; j < column; j++) {
                // loop through 8 directions
                for(let k = 0; k < 8; k++) {
                    const currentAnswers = this.search(i, j, dx[k], dy[k], filter);
                    for(let answer of currentAnswers) {
                        answers.push(answer);
                    }
                }
            }
        }
        return answers;
    }

    dfs(matrix, x, y, trie, ans, pos, answers) {
        const dx = [-1,0,1,-1,1,-1,0,1];
        const dy = [1,1,1,0,0,-1,-1,-1];
        const curr = matrix[x][y];
        const newNode = trie[curr];
        if(!newNode)return;
        if(newNode.isWord) {
            answers.push({
                word: ans, 
                pos: pos.slice(0)
            });
        }
        matrix[x][y] = '0';
        for(let i = 0; i < 8; i++) {
            const nx = x + dx[i];
            const ny = y + dy[i];
            if(nx >= matrix.length || ny >= matrix[0].length)continue;
            if(nx < 0 || ny < 0)continue;
            pos.push(nx * matrix[0].length + ny);
            this.dfs(matrix, nx, ny, newNode, ans + matrix[nx][ny], pos, answers);
            pos.pop();
        }
        matrix[x][y] = curr;
    }

    wordSearch2(matrix) {
        this.matrix = matrix;
        const answers = [];
        const row = this.row = matrix.length;
        const column = this.column = matrix[0].length;
        for(let i = 0; i < row; i++) {
            for(let j = 0; j < column; j++) {

                this.dfs(matrix, i, j, window.Trie.root, matrix[i][j], [i*column+j], answers);
            }
        }
        return answers;
    }

    buildMatrix(str, row, column) {
        let strWithOnlyEnglishLetter = str.replace(/[^A-Za-z\u4e00-\u9fa5\n]/g, '').toLowerCase();
        const returnMat = [];
        row = 0;
        if(!row || !column) {
            const strSplit = strWithOnlyEnglishLetter.split("\n");
            strWithOnlyEnglishLetter = strWithOnlyEnglishLetter.replace(/[\n]/g, '')
            for(let line of strSplit) {
                if(line) {
                    column = line.length;
                    row++;
                }
            }
        }
        let index = 0;

        for(let i = 0; i < row; i++) {
            returnMat.push([]);
            for(let j = 0; j < column; j++) {
                if(!strWithOnlyEnglishLetter[index]) {
                    throw new Error("StringTooShort");
                }
                returnMat[i].push(strWithOnlyEnglishLetter[index]);
                index++;
            }
        }
        if(index < strWithOnlyEnglishLetter.length) {
            throw new Error("StringTooLong");
        }
        return returnMat;
    }

}
