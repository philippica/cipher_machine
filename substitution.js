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
			var curCol = this.matrix[String.fromCharCode(97 + i)];
			curCol = new Array(26);
			for(var j = 0; j < 26; j++) {
				curCol[String.fromCharCode(97 + j)] = MappingTable.possible;
			}
		}
	}
}
MappingTable.possible   = 0;
MappingTable.impossible = 1;


token = function(word, posibleList){this.word = word; this.posibleList = posibleList};

token.prototype = {
	eliminate : function(){}
}


function substituteSolver(text) {
	rawTokens = text.split(/[^a-zA-Z0-9\']+/);
	countOfTokens = rawTokens.length;
	for(var i = 0; i < countOfTokens; i++) {
		console.info(rawTokens[i]);
	}
	return rawTokens;
}
