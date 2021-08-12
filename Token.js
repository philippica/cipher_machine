import { MappingTable } from './MappingTable';

export class Token {
    constructor(word, possibleList, position) {
        this.word = word; 
        this.possibleList = JSON.parse(JSON.stringify(possibleList)); 
        this.position = position;
    }

    eliminate(mappingTable) {
		var len = this.word.length,
		    possibleListLen = this.possibleList.length,
		    deleteList = new Array();
		// For each possible word, delete it if it's letter is not matched.
		for(var i = 0; i < possibleListLen; i++) {
			var flag = 0,
			    possibleWord = this.possibleList[i];
			if(possibleWord === undefined) {
				deleteList[i] = 1;
				continue;
			}
			for(var j = 0; j < len; j++) {			
				if(mappingTable.isAllowed(this.word[j], possibleWord[j]) === MappingTable.impossible) {
					deleteList[i] = 1;
					break;
				}
			}
		}
		for(var i = possibleListLen - 1; i >= 0; i--) {
			if(deleteList[i] === 1) {
				this.possibleList.splice(i, 1);
			}
		}	
	}
    trimMappingTable(mappingTable) {
		var len = this.word.length,
			possibleListLen = this.possibleList.length,
			possibleLetters = new Array(26);
		for(var i = 0; i < len; i++) {
			for(var j = 0; j < 26; j++) {
				possibleLetters[j] = MappingTable.impossible;
			}
			var curLetter = this.word[i];
			for(var j = 0; j < possibleListLen; j++) {
				possibleLetters[this.possibleList[j].charCodeAt(i) - 97] = MappingTable.possible;
			}
			for(var j = 0; j < 26; j++) {
				if(possibleLetters[j] !== MappingTable.possible) {
					mappingTable.disallow(this.word[i], String.fromCharCode(97 + j));
				}
			}
 			if(mappingTable.unique(curLetter) === true) {
				const ensureLetter = mappingTable.ensure[curLetter];
				for(var j = 0; j < 26; j++) {
					if(curLetter === String.fromCharCode(j + 97)){
						continue;
					}
					mappingTable.disallow(String.fromCharCode(97 + j), ensureLetter);
				}
			} 
		}
    }
    customize(mappingTable) {
		this.eliminate(mappingTable);
		this.trimMappingTable(mappingTable);
	}
    copy() {
		var ret = new Token(this.word, this.possibleList, this.position);
		return ret;
	}
}
