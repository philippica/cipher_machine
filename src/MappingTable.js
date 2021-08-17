export class MappingTable {
	static guessPossible   = 3;
	static guessImpossible = 2;
	static possible        = 1;
	static impossible      = 0;
	constructor() {
		this.mode = MappingTable.impossible;
		this.matrix = new Array(26);
		this.ensure = new Array(26);
		for(let i = 0; i < 26; i++) {
			this.matrix[String.fromCharCode(97 + i)] = new Array(26);
			let curCol = this.matrix[String.fromCharCode(97 + i)];
			for(let j = 0; j < 26; j++) {
				curCol[String.fromCharCode(97 + j)] = MappingTable.possible;
			}
		}
	}

	init() {
		this.matrix = new Array(26);
		this.ensure = new Array(26);
		for(let i = 0; i < 26; i++) {
			this.matrix[String.fromCharCode(97 + i)] = new Array(26);
			let curCol = this.matrix[String.fromCharCode(97 + i)];
			for(let j = 0; j < 26; j++) {
				curCol[String.fromCharCode(97 + j)] = MappingTable.possible;
			}
		}
		this.mode = MappingTable.impossible;
	}

	disallow(oriChar, matchedChar) {
		const isChanged = this.matrix[oriChar][matchedChar] !== this.mode;
		this.matrix[oriChar][matchedChar] = this.mode;
		return isChanged;
	}

	unique(ch) {
		let count = 0;
		for(let i = 0; i < 26; i++) {
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
	}

	getAllowedChars(oriChar) {
		const ret = new Array();
		for(let i = 0; i < 26; i++) {
			if(this.matrix[oriChar][String.fromCharCode(97 + j)] !== MappingTable.impossible) {
				ret.push(String.fromCharCode(97 + j));
			}
		}
		return ret;
	}

	isAllowed(oriChar, matchedChar) {
		return this.matrix[oriChar][matchedChar];
	}

	mapMode(mode) {
		this.mode = mode;
	}
	
	copy() {
		const ret = new MappingTable();
		ret.ensure = [].concat(this.ensure);
		for(let i = 0; i < 26; i++) {
			for(let j = 0 ; j < 26; j++) {
				ret.matrix[String.fromCharCode(97 + i)][String.fromCharCode(97 + j)] = this.matrix[String.fromCharCode(97 + i)][String.fromCharCode(97 + j)]
			}
		}
		return ret;
	}
}
