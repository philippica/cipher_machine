import { MappingTable } from './MappingTable';
import { TokenList } from './token-list.js';


export class SubstitutionSolver {
	constructor() {
		this.globleAns = [];
		this.ans = new Array();
		this.weight = [];
	}
	substituteSolver(text) {
		var text = text.toLowerCase();
		var rawTokens = text.split(/[^a-zA-Z0-9\']+/);
		var mappingTable = new MappingTable();
		var unknownWordsList = new TokenList();
		this.globleAns = [];
		this.ans = [];
		var knownWordsList = new TokenList();

		unknownWordsList.build(rawTokens, knownWordsList, mappingTable, this.weight);

		unknownWordsList.refreshByMappintTable(knownWordsList, mappingTable);
	
		this.dfs(unknownWordsList, knownWordsList, mappingTable, 0);
	
		this.globleAns.sort((a, b) => b.weight - a.weight);
		console.info(this.globleAns);
		return text;
	}

	output(answer)
	{
		let ret = "";
		let weight = 0;
		for(let possibleToken of answer.list) {
			ret += possibleToken.possibleList[0] + " ";
			weight += this.weight[possibleToken.possibleList[0]];
		}
		this.globleAns.push({ret, weight});
	}

/*
 *	para:
 *		unknownWordsList - list of unknown words, unknown means it's possiable list is greater than one
 *		answer - list of known words, known means the possible list of it is only one
 *		mappingTable - it's a 26*26 table which represents letter's mapping of ct & pt
 *  return:
 *  	void
*/

	dfs(unknownWordsList, knownWordsList, mappingTable) {
		if(unknownWordsList.empty()) {
			this.output(knownWordsList);
			return;
		}

		const minSizeIndex = unknownWordsList.getMinPossibleList();
		const minLen = unknownWordsList.list[minSizeIndex].possibleList.length;
	
		for(var i = 0; i < minLen; i++) {
			const chooseWord = unknownWordsList.list[minSizeIndex].possibleList[i];
			const dummyUnknownWordsList = unknownWordsList.copy();
			const dummyAns = knownWordsList.copy();
			const dummyMappingTable = mappingTable.copy();
	
			dummyUnknownWordsList.list[minSizeIndex].possibleList = [];
			dummyUnknownWordsList.list[minSizeIndex].possibleList.push(chooseWord);
			const result = dummyUnknownWordsList.refreshByMappintTable(dummyAns, dummyMappingTable);
			if(result[0] === false) {
				continue;
			}
			this.dfs(dummyUnknownWordsList, dummyAns, mappingTable);
		}
	}

}





