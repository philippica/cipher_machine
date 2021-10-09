import { Trie } from "../common/Trie";
import { words } from '../common/dict.js';
import { WordSearch } from "../word-search/wordSearch";

//import { words } from "../common/dict";
export class DropQuote {
    constructor(grids, letters, width, height, blackGridSeprete) {
        this.initTrie();
        this.grids = grids;
        for(let list of letters) {
            list.sort();
        }
        this.letters = letters.map((list)=>list.map((letter)=>{return { letter, isUsed: false}}));
        this.width = width;
        this.height = height;
        this.answer = [];
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


    wordSearch(pos, letterSets, ans, triePos, currentAns, indexOfAnswer) {
        const isusedArr = [];
        if(pos >= letterSets.length) {
            if(triePos.isWord === true) {
                ans.push({currentAns, indexs: indexOfAnswer.slice(0)});
            }
            return;
        }
        for(let i in letterSets[pos]) {
            if(letterSets[pos][i].isUsed === true)continue;
            const ch = letterSets[pos][i].letter;
            if(isusedArr[ch]) {
                continue;
            }
            isusedArr[ch] = true;
            if(!triePos[ch])continue;
            letterSets[pos][i].isUsed = true;
            indexOfAnswer.push(i);
            this.wordSearch(pos+1, letterSets, ans, triePos[ch], currentAns+ch, indexOfAnswer);
            indexOfAnswer.pop();
            letterSets[pos][i].isUsed = false;
        }
    }

    getWords(letterSets) {
        const ans = [];
        this.wordSearch(0, letterSets, ans, this.Trie.root, "", []);
        return ans;
    }

    next(row, col) {
        const index = row * this.width + col + 1;
        if(index > this.width * this.height)return null;
        const newRow = Math.floor(index / this.width);
        const newCol = index % this.width;
        return {
            col: newCol,
            row: newRow
        }
    }
    update(answers, lines, isUsedValue) {
        for(let i in answers.indexs) {
            const index = answers.indexs[i];
            if(lines[i][index].isUsed === isUsedValue) {
                console.info("find bug");
            }
            lines[i][index].isUsed = isUsedValue;
        }
    }
    dfs(row, col, currentAns) {
        if(row >= this.height) {
            console.info(currentAns);
            this.answer.push(currentAns);
            this.callback(currentAns);
            return true;
        }
        if(this.grids[row][col] === false) {
            const nextPos = this.next(row, col);
            const result = this.dfs(nextPos.row, nextPos.col, currentAns);
            return result;
        }
        let currentCol = col;
        let currentRow = row;
        const lines = [];
        for(let wordLen = 1; wordLen <= 14; wordLen++) {
            while(currentRow < this.height && this.grids[currentRow][currentCol] === false) {
                const nextPos = this.next(currentRow, currentCol);
                currentRow = nextPos.row;
                currentCol = nextPos.col;
            }
            if(currentRow >= this.height) {
                return false;
            }
            lines.push(this.letters[currentCol]);

            const nextPos = this.next(currentRow, currentCol);
            currentRow = nextPos.row;
            currentCol = nextPos.col;

            if(this.blackGridSeprete === true) {
                if(currentRow < this.height && this.grids[currentRow][currentCol] === true) {
                    continue;
                }
            }


            const possibleList = this.getWords(lines);



            for(let wordObj of possibleList) {
                this.update(wordObj, lines, true);
                const result = this.dfs(currentRow, currentCol, currentAns + wordObj.currentAns + " ");
                if(result) {
                    // return result;
                }
                this.update(wordObj, lines, false);
            }
        }
        return false;
    }
    calculate(callback, blackGridSeprete) {
        this.blackGridSeprete = blackGridSeprete;
        this.callback = callback;
        this.dfs(0, 0, "");
        return this.answer;
    }

}
