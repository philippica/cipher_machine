import { words } from "../common/dict";
import { Trie } from "../common/Trie";

export class OneWord {
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
    }

    editDistance(s1, s2) {
        var row2 = [];
        if (s1 === s2) {
            return 0;
        } else {
            var s1_len = s1.length, s2_len = s2.length;
            if (s1_len && s2_len) {
                var i1 = 0, i2 = 0, a, b, c, c2, row = row2;
                while (i1 < s1_len)
                    row[i1] = ++i1;
                while (i2 < s2_len) {
                    c2 = s2.charCodeAt(i2);
                    a = i2;
                    ++i2;
                    b = i2;
                    for (i1 = 0; i1 < s1_len; ++i1) {
                        c = a + (s1.charCodeAt(i1) === c2 ? 0 : 1);
                        a = row[i1];
                        b = b < a ? (b < c ? b + 1 : c) : (a < c ? a + 1 : c);
                        row[i1] = b;
                    }
                }
                return b;
            } else {
                return s1_len + s2_len;
            }
        }
    }


    async findByRegularExpression(str, callback) {
        const regularExpression = eval(`/${str}/`);
        const answer = [];
        if(!callback) {
            callback = ()=>{};
        }
        for(let pattern in words) {
            if(!pattern)continue;
            const len = pattern.length;
            for(let word of words[pattern]) {
                if(regularExpression.test(word)) {
                    answer.push(word);
                    await callback(len, word);
                }
            }
        }
        return answer;
    }

    findByWildcard(wildcard, callback) {
        let regx = '';
        for(let x of wildcard) {
            if(x === '#') {
                regx += '.';
            } else if( x === '*') {
                regx += '.*';
            } else {
                regx += x;
            }
        }
        return this.findByRegularExpression(`^${regx}$`, callback);
    }

    makeLetterSet(str) {
        const letterSet = [];
        for(let i = 0; i < str.length; i++) {
            if(!letterSet[str[i]]) {
                letterSet[str[i]] = 0;
            }
            letterSet[str[i]]++;
        }
        return letterSet;
    }

    async onlyContains(letters, callback) {
        const answer = [];
        const letterSet = this.makeLetterSet(letters);
        const containsHelp = (letterSet, str) => {
            const letterCount = [];
            for(let i = 0; i < str.length; i++) {
                if(!letterSet[str[i]]) {
                    return false;
                }
                if(!letterCount[str[i]]){
                    letterCount[str[i]] = 0;
                }
                letterCount[str[i]]++;
            }
            return true;
        }
        for(let patten in words) {
            if(!patten)continue;
            const len = patten.length;
            for(let word of words[patten]) {
                if(containsHelp(letterSet, word)) {
                    await callback(len, word);
                    answer.push(word);
                }
            }
        }
        return answer;
    }

    permutation(letters) {
        const answer = [];
        const letterSet = this.makeLetterSet(letters);
        const containsHelp = (letterSet, str) => {
            const letterCount = [];
            for(let i = 0; i < str.length; i++) {
                if(!letterSet[str[i]]) {
                    return false;
                }
                if(!letterCount[str[i]]){
                    letterCount[str[i]] = 0;
                }
                letterCount[str[i]]++;
            }
            for(let letter in letterSet) {
                if(!letterCount[letter] || letterSet[letter] != letterCount[letter]) {
                    return false;
                }
            }
            return true;
        }
        for(let patten in words) {
            if(!patten)continue;
            for(let word of words[patten]) {
                if(containsHelp(letterSet, word)) {
                    console.info(word);
                    answer.push(word);
                }
            }
        }
        return answer;
    }

    stringInclude(letterSet, str) {
        const letterCount = [];
        for(let i = 0; i < str.length; i++) {
            if(!letterSet[str[i]])continue;
            if(!letterCount[str[i]]){
                letterCount[str[i]] = 0;
            }
            letterCount[str[i]]++;
        }
        for(let letter in letterSet) {
            if(!letterCount[letter] || letterSet[letter] > letterCount[letter]) {
                return false;
            }
        }
        return true;
    }

    async contains(letters, callback) {
        const answers = [];
        if(!callback) {
            callback = ()=>{};
        }
        const letterSet = this.makeLetterSet(letters);
        for(let patten in words) {
            if(!patten)continue;
            const len = patten.length;
            for(let word of words[patten]) {
                if(this.stringInclude(letterSet, word)) {
                    answers.push(word);
                    await callback(len, word);
                }
            }
        }
        return answers;
    }



    async findSimilarity(str, similarityDegree, callback) {
        const answer = [];
        if(!similarityDegree) {
            similarityDegree = 1;
        }
        if(!callback) {
            callback = ()=>{};
        }
        const strLen = str.length;
        for(let patten in words) {
            if(!patten)continue;
            const wordLen = patten.length;
            if(Math.abs(wordLen-strLen) > similarityDegree)continue;
            for(let word of words[patten]) {
                if(this.editDistance(str, word) <= similarityDegree) {
                    answer.push(word);
                    await callback(wordLen, word);
                }
            }
        }
        return answer;
    }

    async findByCode(code, callback) {
        const answer = [];
        if(!callback) {
            callback = ()=>{};
        }
        const tools = {
            isWord: (str) => {
                return this.Trie.contains(str);
            },
            anagram: (str, letters) => {
                const letterSet = this.makeLetterSet(letters);
                return this.stringInclude(letterSet, str);
            }
        }
        try {
            var func = new Function(`return ${code}`)();
            if(!func) {
                throw new Error("没有函数");
            }
        } catch(e) {
            alert(`程序错误，请仔细检查你的代码\n错误信息:\n${e.message}`);
            throw e;
        }
        for(let pattern in words) {
            if(!pattern)continue;
            for(let word of words[pattern]) {
                let ret;
                try {
                    ret = func(word, tools);
                } catch(e) {
                    continue;
                }
                if(ret) {
                    answer.push(ret);
                    await callback(ret.length, ret);
                }
            }
        }
        console.info(code);
    }

}