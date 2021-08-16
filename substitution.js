import { MappingTable } from './MappingTable';
import { TokenList } from './token-list.js';


export class SubstitutionSolver {
	constructor() {
		this.globleAns = [];
		this.ans = new Array();
		this.weight = [];
		this.threshold = 10;
	}
	substituteSolver(text, maxOutput, threshold) {
		this.threshold = threshold || 10;
		this.maxOutput = maxOutput || 3000;
		var text = text.toLowerCase();
		var rawTokens = text.split(/[^a-zA-Z0-9\']+/);
		var mappingTable = new MappingTable();
		var unknownWordsList = new TokenList();
		this.globleAns = [];
		this.ans = [];
		var knownWordsList = new TokenList();

		unknownWordsList.build(rawTokens, knownWordsList, mappingTable, this.weight);

		unknownWordsList.refreshByMappintTable(knownWordsList, mappingTable);
	
		this.dfsNonRecursion(unknownWordsList, knownWordsList, mappingTable);
		// this.dfs(unknownWordsList, knownWordsList, mappingTable);

		this.globleAns.sort((a, b) => b.weight - a.weight);
		console.info(this.globleAns);
		return this.globleAns.map((item)=>item.ret);
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

			dummyUnknownWordsList.setPossibleList(minSizeIndex, chooseWord);

			if(dummyUnknownWordsList.refreshByMappintTable(dummyAns, dummyMappingTable) === false) {
				continue;
			}
			this.dfs(dummyUnknownWordsList, dummyAns, dummyMappingTable);
		}
	}

	dfsNonRecursion(unknownWordsList, knownWordsList, mappingTable) {
		const stack = new Array();
		stack.push({unknownWordsList, knownWordsList, mappingTable});
		let countOfAnswer = 0;
		const stack2 = new Array();
		while(stack.length > 0) {
			const state = stack.pop();
			if(state.unknownWordsList.empty()) {
				this.output(state.knownWordsList);
				countOfAnswer++;
				if(countOfAnswer > this.maxOutput) {
					return;
				}
				continue;
			}

			const minSizeIndex = state.unknownWordsList.getMinPossibleList();
			const minLen = state.unknownWordsList.list[minSizeIndex].possibleList.length;
			const loopLen = Math.min(minLen, this.threshold);
		
			for(var i = 0; i < loopLen; i++) {
				const chooseWord = state.unknownWordsList.list[minSizeIndex].possibleList[i];
				const dummyUnknownWordsList = state.unknownWordsList.copy();
				const dummyAns = state.knownWordsList.copy();
				const dummyMappingTable = state.mappingTable.copy();
	
				dummyUnknownWordsList.setPossibleList(minSizeIndex, chooseWord);
	
				if(dummyUnknownWordsList.refreshByMappintTable(dummyAns, dummyMappingTable) === false) {
					continue;
				}
				stack.push({unknownWordsList: dummyUnknownWordsList, knownWordsList: dummyAns, mappingTable: dummyMappingTable});
			}
			state.unknownWordsList.list[minSizeIndex].possibleList = state.unknownWordsList.list[minSizeIndex].possibleList.slice(loopLen);
			if(state.unknownWordsList.refreshByMappintTable(state.knownWordsList, state.mappingTable) === false) {
				continue;
			}
			stack2.push({
				unknownWordsList: state.unknownWordsList,
				knownWordsList: state.knownWordsList,
				mappingTable: state.mappingTable,
			});
		}

		while(stack2.length > 0) {
			const state = stack2.pop();
			if(state.unknownWordsList.empty()) {
				this.output(state.knownWordsList);
				countOfAnswer++;
				if(countOfAnswer > this.maxOutput) {
					return;
				}
				continue;
			}

			const minSizeIndex = state.unknownWordsList.getMinPossibleList();
			const minLen = state.unknownWordsList.list[minSizeIndex].possibleList.length;
			const loopLen = Math.min(minLen, this.threshold);
		
			for(var i = 0; i < minLen; i++) {
				const chooseWord = state.unknownWordsList.list[minSizeIndex].possibleList[i];
				const dummyUnknownWordsList = state.unknownWordsList.copy();
				const dummyAns = state.knownWordsList.copy();
				const dummyMappingTable = state.mappingTable.copy();
	
				dummyUnknownWordsList.setPossibleList(minSizeIndex, chooseWord);
	
				if(dummyUnknownWordsList.refreshByMappintTable(dummyAns, dummyMappingTable) === false) {
					continue;
				}
				stack2.push({unknownWordsList: dummyUnknownWordsList, knownWordsList: dummyAns, mappingTable: dummyMappingTable});
			}
			state.unknownWordsList.list[minSizeIndex].possibleList = state.unknownWordsList.list[minSizeIndex].possibleList.slice(loopLen);
			state.unknownWordsList.refreshByMappintTable(state.knownWordsList, state.mappingTable);
		}
	}

}




