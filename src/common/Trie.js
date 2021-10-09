

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

}