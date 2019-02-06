function pattern(str) {
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


MappingTable = function() {this.mode = MappingTable.impossible;}
MappingTable.prototype = {
	init : function() {
		this.matrix = new Array(26);
		this.ensure = new Array(26);
		for(var i = 0; i < 26; i++) {
			this.matrix[String.fromCharCode(97 + i)] = new Array(26);
			var curCol = this.matrix[String.fromCharCode(97 + i)];
			for(var j = 0; j < 26; j++) {
				curCol[String.fromCharCode(97 + j)] = MappingTable.possible;
			}
		}
		this.mode = MappingTable.impossible;
	},
	disallow : function(oriChar, matchedChar) {
		this.matrix[oriChar][matchedChar] = this.mode;
	},
	unique : function(ch) {
		var count = 0;
		for(var i = 0; i < 26; i++) {
			if(this.matrix[ch][String.fromCharCode(97 + i)] === MappingTable.possible) {
				this.ensure[ch] = String.fromCharCode(97 + i);
				count++;
				if(count > 1) {
					this.ensure[ch] = null;
					return false;
				}
			}
		}
		return true;
	},
	getAllowedChars : function(oriChar) {
		ret = new Array();
		for(var i = 0; i < 26; i++) {
			if(this.matrix[oriChar][String.fromCharCode(97 + j)] !== MappingTable.impossible) {
				ret.push(String.fromCharCode(97 + j));
			}
		}
		return ret;
	},
	isAllowed : function(oriChar, matchedChar) {
		return this.matrix[oriChar][matchedChar];
	},
	
	mapMode : function(mode) {
		this.mode = mode;
	}
}
MappingTable.guessPossible   = 3;
MappingTable.guessImpossible = 2;
MappingTable.possible        = 1;
MappingTable.impossible      = 0;

var mappingTable = new MappingTable();


Token = function(word, possibleList, position){this.word = word; this.possibleList = possibleList; this.position = position;};

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
 			if(mappingTable.unique(curLetter) === true) {
				ensureLetter = mappingTable.ensure[curLetter];
				for(var j = 0; j < 26; j++) {
					if(curLetter === String.fromCharCode(j + 97)){
						continue;
					}
					mappingTable.disallow(String.fromCharCode(97 + j), ensureLetter);
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
var ans = new Array();


function refreshQue() {
	var loopTime = 0;
	while(queue.length > 0) {
		var topToken = queue.shift();
		topToken.customize(mappingTable);
		if(topToken.possibleList.length > 1) {
			queue.push(topToken);
			loopTime++;
		} else {
			ans[topToken.position] = topToken;
		}
		if(loopTime > 500)break;
	}
}


function substituteSolver(text) {
	var text = text.toLowerCase();
	var rawTokens = text.split(/[^a-zA-Z0-9\']+/);
	countOfTokens = rawTokens.length;
	mappingTable.init();
	queue = [];
	ans = [];
	for(var i = 0; i < countOfTokens; i++) {
		if(rawTokens[i] == "") {
			continue;
		}
		var possibleList = words[pattern(rawTokens[i])].slice(0);
		var curToken = new Token(rawTokens[i], possibleList, i);
		curToken.customize(mappingTable);
		if(curToken.possibleList.length > 1) {
			queue.push(curToken);
		} else {
			ans[curToken.position] = curToken;
		}
	}

	refreshQue();

	var minLen = 3000;
	var minIdx = 0;
	for(var i = 0; i < queue.length; i++) {
		if(queue[i].possibleList.length < minLen) {
			minIdx = i;
			minLen = queue[i].possibleList.length
		} 
	}
	console.info(minLen);


	for(var i = 0; i < queue.length; i++) {
		ans[queue[i].position] = queue[i];
	}
	console.info(ans);
	for(var i = 0; i < ans.length; i++) {
		console.info(ans[i].possibleList[0]);
	}


	return text;
}




