function pattern(str) {
	var curLetter = 0;
	var len = str.length;
	var ret = "";
	var usedLetter = new Array(26);
	for(var i = 0; i < len; i++) {
		console.info(usedLetter[str[i]]);
		if(usedLetter[str[i]] == undefined) {
			usedLetter[str[i]] = String.fromCharCode(curLetter + 97);
			curLetter++;
		}
		ret += usedLetter[str[i]];
	}
	return ret;
}


MappingTable = function() {}
MappingTable.prototype = {
	init : function() {
		this.matrix = new Array(26);
		for(var i = 0; i < 26; i++) {
			this.matrix[String.fromCharCode(97 + i)] = new Array(26);
			var curCol = this.matrix[String.fromCharCode(97 + i)];
			for(var j = 0; j < 26; j++) {
				curCol[String.fromCharCode(97 + j)] = MappingTable.possible;
			}
		}
	},
	disallow : function(oriChar, matchedChar) {
		this.matrix[oriChar][matchedChar] = MappingTable.impossible;
	},
	getAllowedChars : function(oriChar) {
		ret = new Array();
		for(var i = 0; i < 26; i++) {
			if(this.matrix[oriChar][String.fromCharCode(97 + j)] == MappingTable.possible) {
				ret.push(String.fromCharCode(97 + j));
			}
		}
		return ret;
	},
	isAllowed : function(oriChar, matchedChar) {
		return this.matrix[oriChar][matchedChar];
	}
}
MappingTable.possible   = 1;
MappingTable.impossible = 0;

var mappingTable = new MappingTable();


Token = function(word, possibleList){this.word = word; this.possibleList = possibleList};

Token.prototype = {
	eliminate : function(mappingTable) {
		var len = this.word.length,
		    possibleListLen = this.possibleList.length,
		    deleteList = new Array();
		// For each possible word, delete it if it's letter is not matched.
		for(var i = 0; i < possibleListLen; i++) {
			var flag = 0,
			    possibleWord = this.possibleList[i];
			if(possibleWord === undefined) {
				break;
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
		
	},
	trimMappingTable : function(mappingTable) {
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
		}
	},
	customize : function(mappingTable) {
		this.eliminate(mappingTable);
		this.trimMappingTable(mappingTable);
	}
}


var queue = new Array();

function substituteSolver(text) {
	rawTokens = text.split(/[^a-zA-Z0-9\']+/);
	countOfTokens = rawTokens.length;
	mappingTable.init();
	for(var i = 0; i < countOfTokens; i++) {
		console.info(rawTokens[i]);
		var possibleList = words[pattern(rawTokens[i])].slice(0);
		var curToken = new Token(rawTokens[i], possibleList);
		curToken.customize(mappingTable);
		console.info(curToken);
	}
	return rawTokens;
}




