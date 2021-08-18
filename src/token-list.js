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

	generateWeight(possibleList, weight) {
		const possibleListLen = possibleList.length;
		if(possibleListLen > 10) {
			for(let i = 0; i < possibleListLen; i++) {
				if(possibleListLen > 100 && i <= 10) {
					weight[possibleList[i]] = 17;
				}
				else if(i / possibleListLen < 0.4) {
					weight[possibleList[i]] = 15;
				} else if(i / possibleListLen < 0.6) {
					weight[possibleList[i]] = 8;
				} else if(i / possibleListLen < 0.9) {
					weight[possibleList[i]] = 1;
				} else {
					weight[possibleList[i]] = -1;
				}
			}
		} else {
			for(let i = 0; i < possibleListLen; i++) {
				weight[possibleList[i]] = possibleListLen - i;
			}
		}
	}


    build(rawTokens, knownWordsList, mappingTable, weight) {
		const countOfTokens = rawTokens.length;
		for(let i = 0; i < countOfTokens; i++) {
			if(rawTokens[i] == "") {
				continue;
			}
			if(rawTokens[i].includes("'")) {
				const token = rawTokens[i].split("'");
				if(token[1]?.length === 1) {
					const curToken = new Token(token[1], ["s", "t", "d"], i);
					this._list.push(curToken);
				}	
			} else {
				const possibleList = words[this.pattern(rawTokens[i])].slice(0);

				this.generateWeight(possibleList, weight);

				const curToken = new Token(rawTokens[i], possibleList, i);
				curToken.customize(mappingTable);
				if(curToken.possibleList.length > 1) {
					this._list.push(curToken);
				} else {
					knownWordsList.list[curToken.position] = curToken;
				}
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
        for(let i = 0; i < this._list.length; i++) {
			const wordToken = this._list[i];
			if(!wordToken)continue;
            retTokenList.list[i] = wordToken.copy();
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

	refreshByMappintTable(knownWordsList, mappingTable) {
		var loopTime = 0;
        const list = this._list;
		let lastChanged = 0;
		while(list.length > 0) {
			var topToken = list.shift();
			const isChanged = topToken.customize(mappingTable);
			if(topToken.possibleList.length > 1) {
				list.push(topToken);
			} else if (topToken.possibleList.length === 0){
				return false;
			} else {
				knownWordsList.list[topToken.position] = topToken;
			}

			loopTime++;
			if(loopTime - lastChanged > list.length) {
				break;
			}
			if(isChanged) {
				lastChanged = loopTime;
			}
			// if(loopTime > 500)break;
		}
		return true;
	}


	refreshByMappintTable2(knownWordsList, mappingTable) {
		let list = this._list;
		while(1) {
			let isChangedThisTurn = false;
			let newList = [];
			for(let i = 0; i < list.length; i++) {
				var topToken = list[i];
				const isChanged = topToken.customize(mappingTable);
				isChangedThisTurn = isChanged || isChangedThisTurn;
				if(topToken.possibleList.length > 1) {
					newList.push(topToken);
				} else if (topToken.possibleList.length === 0){
					this._list = list;
					return false;
				} else {
					knownWordsList.list[topToken.position] = topToken;
				}
			}
			list = newList;
			if(isChangedThisTurn === false) {
				break;
			}
		}
		this._list = list;
		return true;
	}

    empty() {
        return this._list.length === 0;
    }

	setPossibleList(index, word) {
		this._list[index].possibleList = [];
		this._list[index].possibleList.push(word);
	}
}

