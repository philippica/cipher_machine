// TODO: Need to be refacted, the code here is tooooo terrible
import { SolverParser } from './solverParser';
import { Trie } from '../common/Trie';
export class SudokuSolver {
  constructor() {
    this.possibleArray = [];
    this.connectedRules = [];
    this.globalRules = [];
    this.globalFinalRules = [];
    this.weight = [];
  }

  handleLoop(restrictAreas, _rule) {
    const areasSet = new Set(restrictAreas);
    const globalRules = this.globalRules;
    const n = this.n;
    const m = this.m;
    for(const area of restrictAreas) {
      let possibles = [...this.possibleArray[area]];
      const row = area / m;
      const col = area % m;
      const areas = [area]
      if(row == 0 || !areasSet.has(area - m)) {
        possibles = possibles.filter(x=>!x.includes('U'));
      } else {
        areas.push(area - m);
      }
      if(col == 0 || !areasSet.has(area - 1)) {
        possibles = possibles.filter(x=>!x.includes('L'));
      } else {
        areas.push(area - 1);
      }
      if(row == n-1 || !areasSet.has(area + m)) {
        possibles = possibles.filter(x=>!x.includes('B'));
      } else {
        areas.push(area + m);
      }
      if(col == m-1 || !areasSet.has(area + 1)) {
        possibles = possibles.filter(x=>!x.includes('R'));
      } else {
        areas.push(area +1);
      }
      this.possibleArray[area] = new Set(possibles);
      const rule = {
        restrictAreas: areas,
        rules: {
          loop: _rule.rules.loop
        }
      }
      globalRules.push(rule);
    }
    _rule.rules.loop.areasSet = new Set(areasSet);
  }

  async tryProcess() {
    const n = this.n;
    const m = this.m;
    for(let idx = 0; idx < n * m; idx++) {
      const temp = this.possibleArray[idx];
      if(temp.size <= 1)continue;
      const items = [];
      for(const item of temp) {
        this.possibleArray[idx] = new Set([item]);
        const origin = [];
        const newRule = [];

        let flag = false;
        for(let i = 0; i < this.connectedRules[idx].length; i++) {
          const result = this.relaxRule(this.globalRules[this.connectedRules[idx][i]], origin, this.connectedRules[idx][i], newRule);
          this.resumePossible(origin, newRule);
          if(result === -1) {
            flag = true;
            break;
          }
        }
        if(flag === false) {
          items.push(item);
        }
      }
      this.possibleArray[idx] = new Set(items);
    }
    return this.relax();
  }

  async solve(rulesList, n, m, callback) {
    this.n = n;
    this.m = m;
    this.callback = callback;
    const possibleArray = this.possibleArray;
    const connectedRules = this.connectedRules;
    const globalRules = this.globalRules;
    const globalFinalRules = this.globalFinalRules;
    
    new SolverParser(rulesList, n, m, globalRules, globalFinalRules);

    for (let i = 0; i < n * m; i++) {
      possibleArray.push(undefined);
      connectedRules.push([]);
      this.weight.push(0);
    }

    globalRules.descriptionRules = [];
    globalRules.groupRules = [];
    const forceRule = [];
    for (let i = 0; i < globalRules.length; i++) {
      const rule = globalRules[i];
      const { restrictAreas } = rule;
      const letterSet = rule.rules ? rule.rules.set : undefined;
      if (letterSet) {
        globalRules.descriptionRules.push(i);
        if(rule.rules.force) {
          forceRule.push(i);
          continue;
        }
        if(rule.rules.hashi) {
          this.mergeSet(restrictAreas[0], letterSet);
        } else
        for (let j = 0; j < restrictAreas.length; j++) {
          this.mergeSet(restrictAreas[j], letterSet);
        }
        if(rule.rules.loop) {
          this.handleLoop(restrictAreas, rule);
          continue;
        }
        if(Object.keys(rule.rules).length == 1)continue;
      }
      globalRules.groupRules.push(i);
      for (let j = 0; j < restrictAreas.length; j++) {
        connectedRules[restrictAreas[j]].push(i);
        this.weight[restrictAreas[j]]++;
      }
    }

    for (let i = 0; i < globalFinalRules.length; i++) {
      const rule = globalFinalRules[i];
      const { restrictAreas } = rule;
      if (rule.rules && rule.rules.largerThan) {
        for (let j = 0; j < restrictAreas.length; j++) {
          possibleArray[restrictAreas[j]] = this.largerSet(possibleArray[restrictAreas[j]], rule.rules.largerThan);
        }
      } else if(rule.rules && rule.rules.smallerThan) {
        for (let j = 0; j < restrictAreas.length; j++) {
          possibleArray[restrictAreas[j]] = this.smallSet(possibleArray[restrictAreas[j]], rule.rules.smallerThan);
        }
      }
    }

    for(const index of forceRule) {
      const rule = globalRules[index];
      const { restrictAreas } = rule;
      for (let j = 0; j < restrictAreas.length; j++) {
        this.possibleArray[restrictAreas[j]] = new Set(rule.rules.set);
      }
    }
    this.hasLoop = false;
    let ret = this.relax();
    if(ret != -1 && this.hasLoop) {
      ret = await this.tryProcess();
    }
    $('#sudokuAnswer').html("");
    if(ret != -1)await this.dfs();

    $('#sudokuAnswer').append("已找到所有解");
  };


  relaxDifference(areas, origin, ruleSet) {
    let fixed = [];
    const mp = new Map();
    for (let i = 0; i < areas.length; i++) {
      const possibleList = [...this.possibleArray[areas[i]]];
      for(let j = 0; j < possibleList.length; j++) {
        const temp = mp.get(possibleList[j]);
        if(temp) {
          mp.set(possibleList[j], temp+1);
        } else {
          mp.set(possibleList[j], 1);
        }
      }
    }
    mp.forEach((val, key)=>{
      if(val === 1) {
        for (let i = 0; i < areas.length; i++) {
          const area = areas[i];
          const curPossibleArray = this.possibleArray[area];
          if (curPossibleArray.size > 1 && curPossibleArray.has(key)) {
            if(!origin[area]) {
              origin[area] = new Set(curPossibleArray);
            }
            this.possibleArray[area] = new Set([key]);
            for(const connectedRule of this.connectedRules[area]) {
              ruleSet.add(connectedRule);
            }
          }
        }
      }
    });

    for (let i = 0; i < areas.length; i++) {
      if (this.possibleArray[areas[i]].size === 1) {
        const number = this.possibleArray[areas[i]].values().next().value;
        if(fixed.includes(number)) {
          return -1;
        }
        fixed.push(number);
      }
    }

    for (let j = 0; j < fixed.length; j++) {
      for (let i = 0; i < areas.length; i++) {
        const possibleList = this.possibleArray[areas[i]];
        if (possibleList.size > 1 && possibleList.has(fixed[j])) {
          if(!origin[areas[i]]) {
            origin[areas[i]] = new Set(possibleList);
          }
          possibleList.delete(fixed[j]);
          if (possibleList.size === 0) {
            console.info("No");
            return -1;
          }
          for(const connectedRule of this.connectedRules[areas[i]]) {
            ruleSet.add(connectedRule);
          }
          if (possibleList.size === 1) {
            fixed.push(possibleList.values().next().value);
          }
        }
      }
    }
    fixed = [];
    for (let i = 0; i < areas.length; i++) {
      if (this.possibleArray[areas[i]].size === 1) {
        const number = this.possibleArray[areas[i]].values().next().value;
        if(fixed.includes(number)) {
          return -1;
        }
        fixed.push(number);
      }
    }
    return 1;
  }

  relaxSum(areas, origin, ruleSet, rule) {
    const sum = rule.rules.sum;

    let currentSum = undefined;
    let currentSum2 = 0;
    let fixedCount = areas.length;
    let unknowList = 0;
    let upperBound = 0;
    let lowerBound = 0;
    const maxValues = [];
    const minValues = [];
    for (let i = 0; i < areas.length; i++) {
      const possibleList = [...this.possibleArray[areas[i]]];
      if(possibleList.length === 0) {
        return -1;
      }
      let currentMax = possibleList[0];
      let currentMin = possibleList[0];
      for(const element of possibleList) {
        if(element > currentMax) {
          currentMax = element;
        }
        if(element < currentMin) {
          currentMin = element;
        }
      }
      maxValues[i] = currentMax;
      minValues[i] = currentMin;
      upperBound += currentMax;
      lowerBound += currentMin;
      if(possibleList.length > 1) {
        unknowList = areas[i];
        currentSum = undefined;
        continue;
      }
      currentSum = currentSum?currentSum+possibleList[0] : possibleList[0];
      fixedCount--;
      currentSum2 += possibleList[0];
    }
    for (let i = 0; i < areas.length; i++) {
      const possibleList = this.possibleArray[areas[i]];
      const deleteItem = [];
      for(const element of possibleList) {
        if(upperBound + element - maxValues[i] < sum || lowerBound + element - minValues[i] > sum) {
          deleteItem.push(element);
        }
      }
      if(currentSum !== undefined && currentSum !== sum) {
        return -1;
      }
      if(upperBound < sum || lowerBound > sum) {
        return -1;
      }
      if(deleteItem.length > 0) {
        if(!origin[areas[i]]) {
          origin[areas[i]] = new Set(possibleList);
        }
        for(const connectedRule of this.connectedRules[areas[i]]) {
          ruleSet.add(connectedRule);
        }
        for(const element of deleteItem) {
          possibleList.delete(element);
        }
      }
    }
    if(fixedCount === 1) {
      if(this.possibleArray[unknowList].has(sum - currentSum2)) {
        if(!origin[unknowList]) {
          origin[unknowList] = new Set(possibleList);
        }
        for(const connectedRule of this.connectedRules[unknowList]) {
          ruleSet.add(connectedRule);
        }
        this.possibleArray[unknowList] = new Set([sum - currentSum2]);
      } else {
        return -1;
      }
    }
    return 1;
  }

  relaxCount(areas, origin, rule, ruleSet) {
    let cnt = 0;
    let isFixed = true;
    let hasItemCount = 0;
    for (let i = 0; i < areas.length; i++) {
      const list = this.possibleArray[areas[i]];
      if(list.size <= 0)return -1;
      if(list.has(rule.item)) {
        hasItemCount++;
      }
      if(list.size === 1) {
        if(list.values().next().value=== rule.item){
          cnt++;
        }
      } else {
        isFixed = false;
      }
    }
    if(rule.set) {
      const u = rule.set[0];
      if(hasItemCount < u) {
        return -1;
      }
      if(isFixed && cnt !== u) {
        return -1;
      }
      if(!isFixed && hasItemCount === u) {
        for (let i = 0; i < areas.length; i++) {
          const possibleList = this.possibleArray[areas[i]];
          if(possibleList.size > 1 && possibleList.has(rule.item)) {
            if(!origin[areas[i]]) {
              origin[areas[i]] = this.possibleArray[areas[i]];
            }
            for(const connectedRule of this.connectedRules[areas[i]]) {
              ruleSet.add(connectedRule);
            }
            this.possibleArray[areas[i]] = new Set([rule.item]);
          }
        }
      } else if(!isFixed && cnt === u) {
        for (let i = 0; i < areas.length; i++) {
          const possibleList = this.possibleArray[areas[i]];
          if(possibleList.length > 1 && possibleList.has(rule.item)) {
            if(!origin[areas[i]]) {
              origin[areas[i]] = new Set(possibleList);
            }
            possibleList.delete(rule.item);
            for(const connectedRule of this.connectedRules[areas[i]]) {
              ruleSet.add(connectedRule);
            }
          }
        }
      }
    }
  }

  relaxLinear(rule, areas, origin, ruleSet) {
    let currentResult = 0;
    let upperBound = 0;
    let lowerBound = 0;
    let fixedCount = areas.length;

    const maxValues = [];
    const minValues = [];
    for (let i = 0; i < areas.length; i++) {
      const list = this.possibleArray[areas[i]];
      if(list.size <= 0)return -1;
      if(list.size > 1) {
        return;
      }
      
      const number = list.values().next().value;
      currentResult += number * rule.coefficient[i];
    }
    if(currentResult !== rule.result) {
      return -1;
    }

    for (let i = 0; i < areas.length; i++) {
      const possibleList = [...this.possibleArray[areas[i]]];
      if(possibleList.length === 0) {
        return -1;
      }
      let currentMax = possibleList[0];
      let currentMin = possibleList[0];
      for(const element of possibleList) {
        const temp = element * rule.coefficient[i];
        if(temp > currentMax) {
          currentMax = temp;
        }
        if(temp < currentMin) {
          currentMin = temp;
        }
      }
      maxValues[i] = currentMax;
      minValues[i] = currentMin;
      upperBound += currentMax;
      lowerBound += currentMin;
      fixedCount--;
    }
    if(upperBound < rule.result || lowerBound > rule.result) {
      return -1;
    }

  }


  /*
    -1: unknown
    0: unsatisfied
    1: satisfied
  */
  isSatisfied(areas, rule) {
    const numbers = [];
    for(const area of areas) {
      if(this.possibleArray[area].size !== 1)return -1;
      numbers.push(this.possibleArray[area].values().next().value);
    }
    if(rule.set) {
      for(const number of numbers) {
        if(!rule.set.includes(number)) {
          return 0;
        }
      }
    } else if(rule.largerThan) {
      for(const number of numbers) {
        if(number <= rule.largerThan) {
          return 0;
        }
      }
    } else if(rule.smallerThan) {
      for(const number of numbers) {
        if(number >= rule.smallerThan) {
          return 0;
        }
      }
    } else if(rule.sum) {
      let currentSum = 0;
      for(const number of numbers) {
        currentSum += number;
      }
      if(currentSum !== rule.sum)return 0;
    }
    return 1;
  }

  relaxIfCondition(rule, areas, origin, ruleSet, newRule) {
    if(this.isSatisfied(areas, rule.condition) === 1) {
      for(const statement of rule.statement) {
        const result = this.isSatisfied(statement.restrictAreas, statement.rules);
        if(result === 0)
        {
          return -1;
        } else if(result === -1) {
          if(statement.rules.sum) {
            this.globalRules.push(statement);
            const ruleIndex = this.globalRules.length-1;
            newRule[ruleIndex] = [];
            for(const area of statement.restrictAreas) {
              this.connectedRules[area].push(ruleIndex);
              newRule[ruleIndex].push(area);
            }
          }
          for(const area of statement.restrictAreas) {
            if(this.possibleArray[area].size === 1)continue;
            if(!origin[area]) {
              origin[area] = new Set(this.possibleArray[area]);
            }
            for(const connectedRule of this.connectedRules[area]) {
              ruleSet.add(connectedRule);
            }

            if(statement.rules.set) {
              this.possibleArray[area] = new Set(statement.rules.set);
            } else if(statement.rules.largerThan) {
              this.possibleArray[area] = this.largerSet(this.possibleArray[area], statement.rules.largerThan);
            } else if(statement.rules.smallerThan) {
              this.possibleArray[area] = this.smallSet(this.possibleArray[area], statement.rules.smallerThan);
            }
          }
        }
      }
    }
  }

  relaxWord(areas, origin, ruleSet) {
    const possibleList = [];
    for(const area of areas) {
      possibleList.push(this.possibleArray[area]);
    }
    const words = window.Trie.findAllByPossibleSets(possibleList);
    console.info(words);
    if(words.length >= 1000)return;
    for(let i = 0; i < areas.length; i++) {
      const letters = new Set();
      for(const word of words) {
        letters.add(word[i]);
      }
      const s = new Set([...letters].filter(item => possibleList[i].has(item)));
      if(s.size === this.possibleArray[areas[i]].size) {
        continue;
      }
      if(!origin[areas[i]]) {
        origin[areas[i]] = new Set(this.possibleArray[areas[i]]);
      }
      for(const connectedRule of this.connectedRules[areas[i]]) {
        ruleSet.add(connectedRule);
      }

      this.possibleArray[areas[i]] = new Set([...letters].filter(item => possibleList[i].has(item)));
    }
  }

  relaxBars(areas, origin, ruleSet, rule) {
    console.info(areas, origin, ruleSet, rule);
    // dp1[i][j]: i's grid j's number, last grid is black
    // dp2[i][j]: i's grid j's number, last grid is white
    // dp1[i][j] = dp2[i-number[j]][j-1] & all j to i is black
    // dp2[i][j] = dp2[i-1][j] | dp1[i-1][j]
    const sum = [0];
    const n = areas.length;
    const m = rule.list.length;
    let last = 0;
    const white = [];
    const black = [];
    const border = [];
    const mustBlack = [];
    for(let i = 0; i <= n; i++) {
      white.push(false);
      black.push(false);
      mustBlack.push(false);
    }

    for(let i = 0; i < areas.length; i++) {
      const area = areas[i];
      if(this.possibleArray[area].has(rule.item)) {
        last++;
        if(this.possibleArray[area].size === 1) {
          mustBlack[i+1] = true;
        }
      }
      sum.push(last);
    }
    const dp1 = [[]];
    const dp2 = [[]];
    for(let i = 0; i <= m; i++) {
      dp1[0].push(false);
      dp2[0].push(false);
    }
    dp2[0][0] = true;
    for(let i = 0; i <= m; i++) {
      border.push(n+2);
    }
    for(let i = 1; i <= n; i++) {
      dp1.push([false]);
      if(mustBlack[i])dp2.push([false]);else
      dp2.push([dp2[i-1][0]]);
      for(let j = 1; j <= m; j++) {
        let canBeFill = false;
        if(i - rule.list[j-1] >= 0 && sum[i] - sum[i - rule.list[j-1]] === rule.list[j-1]) {
          canBeFill = true;
        }
        if(canBeFill){
          if(i != n && mustBlack[i+1] === true) {
            dp1[i].push(false);
          } else
          dp1[i].push((dp2[i-rule.list[j-1]][j-1]));
        } else dp1[i].push(false);
        if(mustBlack[i])dp2[i].push(false);else dp2[i].push(dp2[i-1][j] || dp1[i-1][j]);
      }
    }


    for(let i = m; i >= 1; i--) {
      for(let j = border[i]-2; j >= 1; j--) {
        if(dp1[j][i]) {
          border[i-1] = j - rule.list[i-1] + 1;
          break;
        }
      }
    }
    
  
    for(let i = n; i >= 1; i--) {
      if(i < border[0] && mustBlack[i]===false) {
        white[i] = true;
      }
      for(let j = m; j >= 1; j--) {
        if(dp1[i][j] && i < border[j]-1) {
          for(let k = i; k >= i-rule.list[j-1]+1; k--) {
            black[k] = true;
          }
        }
        if(dp2[i][j] && i < border[j] && mustBlack[i]===false) {
          white[i] = true;
        }
      }
    }

    for(let i = 1; i <= n; i++) {
      const list = this.possibleArray[areas[i-1]];
      if(black[i] && !white[i]) {
        if(!list.has(rule.item)) {
          return -1;
        }
      }
      if(!black[i] && white[i]) {
        if(list.has(rule.item) && list.size === 1) {
          return -1;
        }
      }
      if(!black[i] && !white[i]) {
        return -1;
      }
      if(!black[i] && mustBlack[i]) {
        return -1;
      }
    }

    for(let i = 1; i <= n; i++) {
      if(black[i] && !white[i] && this.possibleArray[areas[i-1]].size > 1) {
        if(!origin[areas[i-1]]) {
          origin[areas[i-1]] = new Set(this.possibleArray[areas[i-1]]);
        }
        for(const connectedRule of this.connectedRules[areas[i-1]]) {
          ruleSet.add(connectedRule);
        }
        this.possibleArray[areas[i-1]] = new Set([rule.item]);;
      }
      if(!black[i] && white[i] && this.possibleArray[areas[i-1]].has(rule.item)) {
        if(!origin[areas[i-1]]) {
          origin[areas[i-1]] = new Set(this.possibleArray[areas[i-1]]);
        }
        for(const connectedRule of this.connectedRules[areas[i-1]]) {
          ruleSet.add(connectedRule);
        }
        this.possibleArray[areas[i-1]].delete(rule.item);
      }
    }
  }

  relaxPermutation(areas, origin, ruleSet, rule) {
    const list = Array.from(rule.list);
    const n = areas.length;
    const realAreas = [];
    const alreadyHave = [];

    for(const area of areas) {
      if(this.possibleArray[area].size === 1) {
        const value = this.possibleArray[area].values().next().value;
        if(value === 'black') {
          continue;
        }
        alreadyHave.push(value);
      } else {
        realAreas.push(area);
      }
    }
    for(const item of alreadyHave) {
      let flag = false;
      for(let i = 0; i < list.length; i++) {
        if(item === list[i]) {
          list.splice(i, 1);
          flag = true;
          break;
        }
      }
      if(!flag)return -1;
    }

    const impossible = [];
    for(const item of alreadyHave) {
      let flag = false;
      for(let i = 0; i < list.length; i++) {
        if(item === list[i]) {
          flag = true;
          break;
        }
      }
      if(!flag)impossible.push(item);
    }
    for(const area of realAreas) {
      for(const item of impossible) {
        if(!this.possibleArray[area].has(item)) continue;

        if(!origin[area]) {
          origin[area] = new Set(this.possibleArray[area]);
        }
        for(const connectedRule of this.connectedRules[area]) {
          ruleSet.add(connectedRule);
        }
        this.possibleArray[area];
      }
    }
  }

  relaxLoop(areas, origin, rule, ruleSet) {
    const opp = {'U': 'B', 'L': 'R', 'R': 'L','B': 'U'};
    const dirIdx = {'U': 0, 'B': 1, 'L': 2,'R': 3};
    const dirs = ['U', 'B', 'L', 'R'];
    const dirsOps = [-this.m, this.m, -1, 1];
    const cur = areas[0];
    let curPossibles = [...this.possibleArray[cur]];
    const count = {};
    for(const item of curPossibles) {
      if(item.length != 2)continue;
      count[item[0]] = (count[item[0]] || 0) + 1;
      count[item[1]] = (count[item[1]] || 0) + 1;
    }
    const lastLen = curPossibles.length;

    const isLoop = (start, end, dir) => {
      let cur = start;
      let lastDir = dir;
      let count = 0;
      while(1) {
        if(cur == end)return count+1;
        if(!cur || this.possibleArray[cur].size != 1)return;
        const d = this.possibleArray[cur].values().next().value.replace(lastDir, '');
        cur = cur + dirsOps[dirIdx[d]];
        lastDir = opp[d];
        count++;
      }
    }

    let dummyCurPossibles = [];
    let dummyCurPossibles2 = [];

    for(let i = 0; i < 4; i++) {
      const dir = dirs[i];
      const dirOp = dirsOps[i];
      const area = cur+dirOp;

      if(areas.indexOf(cur + dirOp) == -1)continue;
      const oppDir = opp[dir];
      let neighbour = [...this.possibleArray[area]];
      if(!count[dir]) {
        if(neighbour.filter(x=>!x.includes(oppDir)).length <= 0) {
          return -1;
        }

        neighbour = neighbour.filter(x=>!x.includes(oppDir));
        if(this.possibleArray[area].size != neighbour.length){
          if(!origin[area]) {
            origin[area] = new Set(this.possibleArray[area]);
          }
          for(const connectedRule of this.connectedRules[area]) {
            ruleSet.add(connectedRule);
          }
          this.possibleArray[area] = new Set(neighbour);
        }
      } else if(count[dir] === curPossibles.length) {
        if(neighbour.filter(x=>x.includes(oppDir)).length <= 0) {
          return -1;
        }

        neighbour = neighbour.filter(x=>x.includes(oppDir));
        if(this.possibleArray[area].size != neighbour.length){
          if(!origin[area]) {
            origin[area] = new Set(this.possibleArray[area]);
          }
          for(const connectedRule of this.connectedRules[area]) {
            ruleSet.add(connectedRule);
          }
          this.possibleArray[area] = new Set(neighbour);
        }
      } else {
        if(neighbour.filter(x=>x.includes(oppDir)).length <= 0) {
          dummyCurPossibles.push(dir);
        }
        if(neighbour.filter(x=>!x.includes(oppDir)).length == 0) {
          dummyCurPossibles2.push(dir);
        }
      }
    }

    for(const dir of dummyCurPossibles) {
      curPossibles = curPossibles.filter(x=>!x.includes(dir));
    }
    for(const dir of dummyCurPossibles2) {
      curPossibles = curPossibles.filter(x=>x.includes(dir));
    }


    
    if(rule.number == 1)for(let i = 0; i < curPossibles.length; i++) {
      const possible = curPossibles[i];
      if(possible == 'UR' || possible == 'UL') {
        continue;
      }
      const diri = cur + dirsOps[dirIdx[possible[0]]], dirj = cur + dirsOps[dirIdx[possible[1]]];
      const x = [...this.possibleArray[diri]].filter(x=>x.includes(opp[possible[0]]));
      const y = [...this.possibleArray[dirj]].filter(x=>x.includes(opp[possible[1]]));
      if(x.length != 1 || y.length != 1)continue;
      const originx = this.possibleArray[diri];
      this.possibleArray[diri] = new Set(x);
      const loopLen = isLoop(diri, dirj, opp[possible[0]]);
      if(loopLen && loopLen + 1 != rule.areasSet.size) {
        curPossibles[i] = '';
      }
      this.possibleArray[diri] = originx;
    }
    curPossibles = curPossibles.filter(x=>x!='');
    

    if(lastLen > curPossibles.length) {
      if(!origin[cur]) {
        origin[cur] = new Set(this.possibleArray[cur]);
      }
      for(const connectedRule of this.connectedRules[cur]) {
        ruleSet.add(connectedRule);
      }
      this.possibleArray[cur] = new Set(curPossibles);
    }
  }

  relaxHashi(areas, origin, rule, ruleSet) {
    const dirs = ['u', 'd', 'l', 'r'];
    const oppDir = {'u': 'd', 'd': 'u', 'l': 'r', 'r': 'l'};
    const to = rule.to;
    const possibles = this.possibleArray[areas[0]];
    const getIntersection = (setA, setB) => new Set(setB.filter(element => setA.includes(element)));
    const getSet = (set, dir) => {
      const ret = [];
      for(const item of set) {
        ret.push(item.hashi[dir]);
      }
      return ret;
    };
    for(const dir of dirs) {
      const neighbour = to[dir];
      if(!neighbour)continue;
      const neighbourPossible = [...this.possibleArray[neighbour]];
      const opp = oppDir[dir];
      const inter = getIntersection(getSet(possibles, dir), getSet(neighbourPossible, opp));
      for(const item of possibles) {
        if(!inter.has(item.hashi[dir])) {
          if(!origin[areas[0]]) {
            origin[areas[0]] = new Set(this.possibleArray[areas[0]]);
          }
          for(const connectedRule of this.connectedRules[areas[0]]) {
            ruleSet.add(connectedRule);
          }
          this.possibleArray[areas[0]].delete(item);
        }
      }
      for(const item of neighbourPossible) {
        if(!inter.has(item.hashi[opp])) {
          if(!origin[neighbour]) {
            origin[neighbour] = new Set(this.possibleArray[neighbour]);
          }
          for(const connectedRule of this.connectedRules[neighbour]) {
            ruleSet.add(connectedRule);
          }
          this.possibleArray[neighbour].delete(item);
        }
      }
    }
    if(rule.conflict) {
      if(rule.conflict.d){
        const d = rule.conflict.d.rules;
        let flag = false;
        if(d)for(const cflct of d) {
          const area = [...this.possibleArray[cflct.to.self]].filter(x=>!x.r);
          if(area.length > 0) {
            flag = true;
            break;
          }
        }
        if(flag) {
          const newPossible = [...this.possibleArray[areas[0]]].filter(x=>!x.d);
          if(newPossible.length < this.possibleArray[areas[0]].size){
            if(!origin[areas[0]]) {
              origin[areas[0]] = new Set(this.possibleArray[areas[0]]);
            }
            this.possibleArray[areas[0]] = new Set(newPossible);
          }
        }
      }
    }
  }

  relaxRule(rule, origin, index, newRule) {
    const ruleSet = new Set([]);
    const areas = rule.restrictAreas;
    if (rule.rules.isDifferent) {
      const ret = this.relaxDifference(areas, origin, ruleSet);
      if(ret === -1)return -1;
    } else if (rule.rules.sum) {
      const ret = this.relaxSum(areas, origin, ruleSet, rule);
      if(ret === -1)return -1;
    } else if(rule.rules.count) {
      const ret = this.relaxCount(areas, origin, rule.rules.count, ruleSet);
      if(ret === -1)return -1;
    } else if(rule.rules.linear) {
      const ret = this.relaxLinear(rule.rules.linear, areas, origin, ruleSet);
      if(ret === -1)return -1;
    } else if(rule.rules.ifCondition) {
      const ret = this.relaxIfCondition(rule.rules.ifCondition, areas, origin, ruleSet, newRule);
      if(ret === -1)return -1;
    } else if(rule.rules.isWord) {
      const ret = this.relaxWord(areas, origin, ruleSet);
      if(ret === -1)return -1;
    } else if(rule.rules.bars)  {
      const ret = this.relaxBars(areas, origin, ruleSet, rule.rules.bars);
      if(ret === -1)return -1;
    } else if(rule.rules.permutation) {
      const ret = this.relaxPermutation(areas, origin, ruleSet, rule.rules.permutation);
      if(ret === -1)return -1;
    } else if(rule.rules.loop) {
      const ret = this.relaxLoop(areas, origin, rule.rules.loop, ruleSet);
      if(ret === -1)return -1;
      this.hasLoop = true;
    } else if(rule.rules.hashi) {
      const ret = this.relaxHashi(areas, origin, rule.rules.hashi, ruleSet);
      if(ret === -1)return -1;
    }

    for(const rules of ruleSet) {
      if(index === rules)continue;
      const result = this.relaxRule(this.globalRules[rules], origin, rules, newRule);
      if(result === -1)return -1;
    }
    return 1;
  };

  print() {
    const result = [];
      let answer = "";
      let temp = [];
      for(let i = 0; i < this.possibleArray.length; i++) {
        const possibleArray = this.possibleArray[i];
        if(!possibleArray || possibleArray.size != 1)continue;
        const number = possibleArray ? possibleArray.values().next().value : ' ';
        if(number.hashi) {
          const r = number.to['r'];
          const rnum = number.hashi['r'];
          const d = number.to['d'];
          const dnum = number.hashi['d'];
          if(r) {
            let cur = i+1;
            $(`.sudoku-grid #grid-${cur}`).html("");
            const interval = 100 / (rnum+1);
            while(cur != r) {
              for(let i = 0; i < rnum; i++) {
                $(`.sudoku-grid #grid-${cur}`).append(`<div class="horizon-" style="top:${interval*(i+1)}%"></div>`);
              }
              cur++;
            }
          }
          if(d) {
            let cur = i+this.m;
            $(`.sudoku-grid #grid-${cur}`).html("");
            const interval = 100 / (dnum+1);
            while(cur != d) {
              for(let i = 0; i < dnum; i++) {
                $(`.sudoku-grid #grid-${cur}`).append(`<div class="vertical-" style="left:${interval*(i+1)}%"></div>`);
              }
              cur+=this.m;
            }
          }

        } else if(number === 'black') {
          $(`.sudoku-grid #grid-${i}`).css("background-color", number);
          $(`.sudoku-grid #grid-${i}`).css("color", "white");
        } else if(number === 'white') {
          $(`.sudoku-grid #grid-${i}`).css("background-color", number);
          $(`.sudoku-grid #grid-${i}`).css("color", "black");
        } else if(number.length == 2) {
          $(`.sudoku-grid #grid-${i}`).attr("class", "sudoku-grid-content " + number);
          $(`.sudoku-grid #grid-${i}`).css("color", "white");
        } else {
          $(`.sudoku-grid #grid-${i}`).css("background-color", number);
        }
        temp.push(number);
        answer += number + ' ';
        if(i % this.m === this.m-1) {
          result.push(temp);
          answer += '\n';
          temp = [];
        }
      }
      $('#sudokuAnswer').append(answer + "\n-----------------------\n");
  }

  relax() {
    for (let i = 0; i < this.globalRules.groupRules.length; i++) {
      const rule = this.globalRules[this.globalRules.groupRules[i]];
      const ret = this.relaxRule(rule, [], this.globalRules.groupRules[i], []);
      if(ret == -1)return ret;
    }
  };

  mergeSet(pos, set) {
    const getIntersection = (setA, setB) => new Set(setB.filter(element => setA.has(element)));
    if (this.possibleArray[pos] === undefined) {
      this.possibleArray[pos] = new Set(set);
    } else {
      this.possibleArray[pos] = getIntersection(this.possibleArray[pos], set);
    }
  };

  getSmallestGrid() {
    let smallestGridIndex = -1;
    let smallestGridSize = 1024;
    let largestW = 0;
    for(let i = 0; i < this.possibleArray.length; i++) {
      const currentSetSize = this.possibleArray[i] ? this.possibleArray[i].size : 1;
      const w = this.weight[i];
      if(currentSetSize === 1)continue;
      if(currentSetSize < smallestGridSize || (currentSetSize == smallestGridSize && w > largestW)) {
        largestW = w;
        smallestGridSize = currentSetSize;
        smallestGridIndex = i;
      }
      if(smallestGridSize === 2 && w != 0) {
        return smallestGridIndex;
      }
    }
    return smallestGridIndex;
  }

  async dfs() {
    const smallestGridIndex = this.getSmallestGrid();
    if(smallestGridIndex === -1) {
      this.print();
      await this.callback();
      if (confirm('发现了一个解，是否继续寻找下一个解?(可能耗时很久)')) {
        return 0;
      } else {
        return -1;
      }
    }
    const set = this.possibleArray[smallestGridIndex];

    for (const item of set.values()) {
      const origin = [];
      const newRule = [];
      origin[smallestGridIndex] = new Set(this.possibleArray[smallestGridIndex]);
      this.possibleArray[smallestGridIndex] = new Set([item]);
      if(this.connectedRules[smallestGridIndex]){
        let flag = false;
        for(let i = 0; i < this.connectedRules[smallestGridIndex].length; i++) {
          const result = this.relaxRule(this.globalRules[this.connectedRules[smallestGridIndex][i]], origin, this.connectedRules[smallestGridIndex][i], newRule);
          if(result === -1) {
            this.resumePossible(origin, newRule);
            flag = true;
            break;
          }
        }
        if (flag === true) {
          continue;
        }
      }

      const result = await this.dfs();
      if(result === -1) {
        return result;
      }
      this.resumePossible(origin, newRule);
    }
    this.possibleArray[smallestGridIndex] = set;

  };

  resumePossible(origin, newRule) {
    origin.forEach((set, index) => {
      this.possibleArray[index] = set;
    });
    newRule.forEach((sets, index) => {
      for(const index of sets) {
        this.connectedRules[index].pop();
      }
      this.globalRules.pop();
    });
  }

  largerSet(list, num) {
    const ret = new Set([]);
    for(const x of list) {
      if(x > num) {
        ret.add(x);
      }
    }
    return ret;
  }

  smallSet(list, num) {
    const ret = new Set([]);
    for(const x of list) {
      if(x < num) {
        ret.add(x);
      }
    }
    return ret;
  }

};

