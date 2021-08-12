import { Token } from './Token';
import { words } from './dict.js';

export class TokenList {
    constructor() {
        this._list = [];
    }

	pattern(str) {
		var curLetter = 0;
		var len = str.length;
		var ret = "";
		var usedLetter = new Array(26);
		for(var i = 0; i < len; i++) {
			if(usedLetter[str[i]] == undefined) {
				usedLetter[str[i]] = String.fromCharCode(curLetter + 97);
				curLetter++;
			}
			ret += usedLetter[str[i]];
		}
		return ret;
	}


    build(rawTokens, ans, mappingTable) {
		const countOfTokens = rawTokens.length;
		for(let i = 0; i < countOfTokens; i++) {
			if(rawTokens[i] == "") {
				continue;
			}
			const possibleList = words[this.pattern(rawTokens[i])].slice(0);
			const curToken = new Token(rawTokens[i], possibleList, i);
			curToken.customize(mappingTable);
			if(curToken.possibleList.length > 1) {
				this._list.push(curToken);
			} else {
				ans[curToken.position] = curToken;
			}
		}
    }

    set list(val) {
        this._list = val;
    }

    get list() {
        return this._list;
    }

    push(token) {
        this._list.push(token);
    }

    copy() {
        const retTokenList = new TokenList();
        for(let unknwonWordToken of this._list) {
            retTokenList.push(unknwonWordToken.copy());
        }
        return retTokenList;
    }

    getMinPossibleList() {
		var minLen = this._list[0].possibleList.length;
		var minIndex = 0;
		for(let i = 0; i < this._list.length; i++) {
			if(minLen > this._list[i].possibleList.length) {
				minLen = this._list[i].possibleList.length;
				minIndex = i;
			}
		}
        return minIndex;
    }

	refreshByMappintTable(answer, mappingTable) {
		var loopTime = 0;
        const list = this._list;
		while(list.length > 0) {
			var topToken = list.shift();
			topToken.customize(mappingTable);
			if(topToken.possibleList.length > 1) {
				list.push(topToken);
				loopTime++;
			} else if (topToken.possibleList.length === 0){
				return 0;
			} else {
				answer[topToken.position] = topToken;
			}
			if(loopTime > 500)break;
		}
		return 1;
	}

    empty() {
        return this._list.length === 0;
    }
}

