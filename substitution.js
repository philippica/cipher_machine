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


MappingTable = function(matrix) {this.matrix = matrix;}
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
MappingTable.possible   = 0;
MappingTable.impossible = 1;


token = function(word, possibleList){this.word = word; this.possibleList = posibleList};

token.prototype = {
	eliminate : function(mappingTable){
		var len = this.word.length;
		for(var possibleWord in this.possibleList) {
			var flag = 0;
			for(var i = 0; i < len; i++) {
				if(mappingTable.isAllowed(this.word[i], possibleWord[i]) == MappingTable.impossible) {
					flag = 1;
					break;
				}
			}
			if(flag) {
				this.possibleList
			}
		}
	}
}


function substituteSolver(text) {
	rawTokens = text.split(/[^a-zA-Z0-9\']+/);
	countOfTokens = rawTokens.length;
	for(var i = 0; i < countOfTokens; i++) {
		console.info(rawTokens[i]);
	}
	return rawTokens;
}
