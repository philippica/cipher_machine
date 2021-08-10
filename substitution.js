import { words } from './dict.js';
import { MappingTable } from './MappingTable';
import { Token } from './Token';



export class SubstitutionSolver {
	constructor() {
		this.globleAns = [];
		this.queue = new Array();
		this.ans = new Array();
	}
	substituteSolver(text) {
		var text = text.toLowerCase();
		var rawTokens = text.split(/[^a-zA-Z0-9\']+/);
		var mappingTable = new MappingTable();
		this.globleAns = [];
		const countOfTokens = rawTokens.length;
		this.queue = [];
		this.ans = [];
		for(var i = 0; i < countOfTokens; i++) {
			if(rawTokens[i] == "") {
				continue;
			}
			const possibleList = words[this.pattern(rawTokens[i])].slice(0);
			const curToken = new Token(rawTokens[i], possibleList, i);
			curToken.customize(mappingTable);
			if(curToken.possibleList.length > 1) {
				this.queue.push(curToken);
			} else {
				this.ans[curToken.position] = curToken;
			}
		}
	
		this.refreshQue(this.queue, this.ans, mappingTable);
	
	
		this.dfs(this.queue, this.ans, mappingTable, 0);
	
		this.globleAns.sort(function(a, b) {
			return a.weight - b.weight;
		});
		console.info(this.globleAns);
		return text;
	}

	pattern(str) {
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

	refreshQue(que, answer, mappingTable) {
		var loopTime = 0;
		while(que.length > 0) {
			var topToken = que.shift();
			topToken.customize(mappingTable);
			if(topToken.possibleList.length > 1) {
				que.push(topToken);
				loopTime++;
			} else if (topToken.possibleList.length === 0){
				return 0;
			} else {
				answer[topToken.position] = topToken;
			}
			if(loopTime > 500)break;
		}
		return 1;
	}

	output(answer, queue, weight)
	{
		var ret = "";
		answer.sort((a, b)=>{
			return a.position - b.position;
		});
		for(var idx in answer) {
			ret += answer[idx].possibleList[0] + " ";
		}
		this.globleAns.push({ret, weight});
		//console.info(ret);
	}

	dfs(que, answer, mappingTable, totalWeight) {
		if(que.length === 0) {
			this.output(answer, que, totalWeight);
			return;
		}
	
		var minLen = que[0].possibleList.length;
		var minIdx = 0;
		for(var i = 0; i < que.length; i++) {
			if(minLen > que[i].possibleList.length) {
				minLen = que[i].possibleList.length;
				minIdx = i;
			}
		}
	
		for(var i = 0; i < minLen; i++) {
			var weight = (i + 1) * 100.0 / minLen;
			var dummyQue = new Array();
			var dummyAns = new Array();
			var dummyMappingTable = mappingTable.copy();
	
			for(var j = 0; j < que.length; j++) {
				dummyQue.push(que[j].copy());
			}
	
			for(var idx in answer) {
				dummyAns[answer[idx].position] = answer[idx].copy();
				//dummyAns.push(answer[idx].copy());
			}
	
			dummyQue[minIdx].possibleList = [];
			dummyQue[minIdx].possibleList.push(que[minIdx].possibleList[i]);
			if(this.refreshQue(dummyQue, dummyAns, dummyMappingTable) === 0) {
				continue;
			}
			this.dfs(dummyQue, dummyAns, mappingTable, totalWeight + weight);
		}
	}

}





