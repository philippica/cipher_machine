function substituteSolver(text) {
	tokens = text.split(/[^a-zA-Z0-9\']+/);
	countOfTokens = tokens.length;
	return tokens;
}
