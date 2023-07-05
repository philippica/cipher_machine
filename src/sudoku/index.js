// TODO: Need to be refacted, the code here is tooooo terrible
import { SolverParser } from './solverParser';
export class SudokuSolver {
  constructor() {
    this.possibleArray = [];
    this.connectedRules = [];
    this.globalRules = [];
    this.globalFinalRules = [];
    this.weight = [];
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
    for (let i = 0; i < globalRules.length; i++) {
      const rule = globalRules[i];
      const { restrictAreas } = rule;
      const letterSet = rule.rules ? rule.rules.set : undefined;
      if (letterSet) {
        globalRules.descriptionRules.push(i);
        for (let j = 0; j < restrictAreas.length; j++) {
          this.mergeSet(restrictAreas[j], letterSet);
        }
      } else {
        globalRules.groupRules.push(i);
        for (let j = 0; j < restrictAreas.length; j++) {
          connectedRules[restrictAreas[j]].push(i);
          this.weight[restrictAreas[j]]++;
        }
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
    this.relax();
    $('#sudokuAnswer').html("");
    await this.dfs();
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
    console.info(rule);
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
    console.info(rule);
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
    consoleo.info();
  }

  relaxBars(areas, origin, ruleSet, rule) {
    console.info(areas, origin, ruleSet, rule);
    // dp1[i][j]: i's grid j's number, last grid is black
    // dp2[i][j]: i's grid j's number, last grid is white
    // dp1[i][j] = dp2[i-number[j]][j-1] & all j to i is black
    // dp2[i][j] = dp2[i-1][j] | dp1[i-1][j]
    const sum = [0];
    let last = 0;
    for(const area of areas) {
      console.info(this.possibleArray[area]);
      if(this.possibleArray[area].has(rule.item)) {
        last++;
      }
      sum.push(last);
    }
    const n = areas.length;
    const m = rule.list.length;
    const dp1 = [[]];
    const dp2 = [[]];
    for(let i = 0; i <= m; i++) {
      dp1[0].push(false);
      dp2[0].push(true);
    }
    for(let i = 1; i <= n; i++) {
      dp1.push([false]);
      dp2.push([true]);
      for(let j = 1; j <= m; j++) {
        let canBeFill = false;
        if(i - rule.list[j-1] >= 0 && sum[i] - sum[i - rule.list[j-1]] === rule.list[j-1]) {
          canBeFill = true;
        }
        if(canBeFill)dp1[i].push((dp2[i-rule.list[j-1]][j-1]));else dp1[i].push(false);
        dp2[i].push(dp2[i-1][j] || dp1[i-1][j]);
      }
    }
    console.info(dp1, dp2);

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
    }

    for(const rules of ruleSet) {
      const result = this.relaxRule(this.globalRules[rules], origin, newRule);
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
        const number = possibleArray ? possibleArray.values().next().value : ' ';
        if(number === 'black') {
          $(`.sudoku-grid #grid-${i}`).css("background-color", number);
          $(`.sudoku-grid #grid-${i}`).css("color", "white");
        } else if(number === 'white') {
          $(`.sudoku-grid #grid-${i}`).css("background-color", number);
          $(`.sudoku-grid #grid-${i}`).css("color", "black");
        }
        temp.push(number);
        answer += number + ' ';
        if(i % this.m === this.m-1) {
          result.push(temp);
          answer += '\n';
          temp = [];
        }
      }
      console.info(result);
      console.info(answer);
      $('#sudokuAnswer').append(answer + "\n-----------------------\n");
  }

  relax() {
    for (let i = 0; i < this.globalRules.groupRules.length; i++) {
      const rule = this.globalRules[this.globalRules.groupRules[i]];
      this.relaxRule(rule, [], i, []);
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

