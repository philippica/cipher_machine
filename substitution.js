import { words } from './dict.js';
import { MappingTable } from './MappingTable';
import { Token } from './Token';
import { TokenList } from './token-list.js';


export class SubstitutionSolver {
	constructor() {
		this.globleAns = [];
		this.ans = new Array();
	}
	substituteSolver(text) {
		var text = text.toLowerCase();
		var rawTokens = text.split(/[^a-zA-Z0-9\']+/);
		var mappingTable = new MappingTable();
		var unknownWordsList = new TokenList();
		this.globleAns = [];
		this.ans = [];

		unknownWordsList.build(rawTokens, this.ans, mappingTable);

		unknownWordsList.refreshByMappintTable(this.ans, mappingTable);
	
		this.dfs(unknownWordsList, this.ans, mappingTable, 0);
	
		this.globleAns.sort(function(a, b) {
			return a.weight - b.weight;
		});
		console.info(this.globleAns);
		return text;
	}

	output(answer, weight)
	{
		var ret = "";
		answer.sort((a, b)=>{
			return a.position - b.position;
		});
		for(var idx in answer) {
			ret += answer[idx].possibleList[0] + " ";
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

	dfs(unknownWordsList, answer, mappingTable, totalWeight) {
		if(unknownWordsList.empty()) {
			this.output(answer, totalWeight);
			return;
		}

		const minSizeIndex = unknownWordsList.getMinPossibleList();
		const minLen = unknownWordsList.list[minSizeIndex].possibleList.length;
	
		for(var i = 0; i < minLen; i++) {
			var weight = (i + 1) * 100.0 / minLen;
			const dummyUnknownWordsList = unknownWordsList.copy();
			const dummyAns = new Array();
			const dummyMappingTable = mappingTable.copy();

	
			for(var idx in answer) {
				dummyAns[answer[idx].position] = answer[idx].copy();
				//dummyAns.push(answer[idx].copy());
			}
	
			dummyUnknownWordsList.list[minSizeIndex].possibleList = [];
			dummyUnknownWordsList.list[minSizeIndex].possibleList.push(unknownWordsList.list[minSizeIndex].possibleList[i]);
			if(dummyUnknownWordsList.refreshByMappintTable(dummyAns, dummyMappingTable) === 0) {
				continue;
			}
			this.dfs(dummyUnknownWordsList, dummyAns, mappingTable, totalWeight + weight);
		}
	}

}





