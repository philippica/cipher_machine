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


function substituteSolver(text) {
	tokens = text.split(/[^a-zA-Z0-9\']+/);
	countOfTokens = tokens.length;
	for(var i = 0; i < countOfTokens; i++) {
		console.info(tokens[i]);
	}
	return tokens;
}
