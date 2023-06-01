

class TrieNode {
    constructor() {
        this.isWord = false;
    }
}

export class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(str) {
        if(!str)return;
        let currentNode = this.root;
        for(let i = 0; i < str.length; i++) {
            if(!currentNode[str[i]]) {
                currentNode[str[i]] = new TrieNode();
            }
            currentNode = currentNode[str[i]];
        }
        currentNode.isWord = true;
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

    findAll(str) {
        const answer = [];
        let currentNode = this.root;
        let currentStr = "";
        for(let i = 0; i < str.length; i++) {
            const nextLetter = currentNode[str[i]];
            currentStr += str[i];
            if(!nextLetter) {
                break;
            }
            if(nextLetter.isWord) {
                answer.push(currentStr);
            }
            currentNode = nextLetter;
        }
        return answer;
    }

    dfs(possibleSets, index, currentNode, str, answer) {
        if(index === possibleSets.length) {
            if(currentNode.isWord) {
                answer.push(str);
            }
            return;
        }
        const currentSet = possibleSets[index];
        for(let i = 0; i < currentSet.length; i++) {
            const currentLetter = currentSet[i];
            const nextLetter = currentNode[currentLetter];
            if(!nextLetter) {
                continue;
            }
            this.dfs(possibleSets, index + 1, nextLetter, str + currentLetter, answer);
        }
    }

    findAllByPossibleSets(possibleSets) {
        const _possibleSets = [];
        for(let i = 0; i < possibleSets.length; i++) {
            const currentSet = possibleSets[i];
            _possibleSets.push([...new Set(currentSet)]);
        }
        const answer = [];
        this.dfs(_possibleSets, 0, this.root, "", answer);
        return answer;
    }
}