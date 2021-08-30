import { Trie } from "./Trie";
import { words } from '../common/dict.js';

//import { words } from "../common/dict";
export class WordSearch {
    constructor() {
        this.initTrie();
    }
    
    initTrie() {
        if(!window.Trie) {
            window.Trie = new Trie();
            for(let patten in words) {
                if(!patten)continue;
                for(let word of words[patten]) {
                    window.Trie.insert(word);
                }
            }
        }
        this.Trie = window.Trie;
        this.customTrie = new Trie();
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
        const answers = this.Trie.findAll(str).filter((word)=>word.length>=2).map((word)=> {
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
    buildMatrix(str, row, column) {
        let strWithOnlyEnglishLetter = str.replace(/[^A-Za-z\n]/g, '').toLowerCase();
        const returnMat = [];
        if(!row || !column) {
            const strSplit = str.split("\n");
            strWithOnlyEnglishLetter = strWithOnlyEnglishLetter.replace(/[\n]/g, '')
            while(strSplit.length > 0) {
                if(strSplit[strSplit.length - 1]) {
                    break;
                }
                strSplit.pop();
            }
            row = strSplit.length;
            column = strSplit[0].length;
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

const aa = new WordSearch();
const mat = aa.buildMatrix("abc\ndef\nghi")
console.info(mat);
aa.wordSearch(mat);
