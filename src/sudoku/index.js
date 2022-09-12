// TODO: Need to be refacted, the code here is tooooo terrible
import { SolverParser } from './solverParser';
export class SudokuSolver {
  constructor(rulesList, n, m) {
    this.n = n;
    this.m = m;

    this.possibleArray = [];
    this.connectedRules = [];
    this.globalRules = [];
    this.globalFinalRules = [];
    this.weight = [];
    this.solve(rulesList, n, m);
  }

  solve(rulesList, n, m) {
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
          possibleArray[restrictAreas[j]] = this.smallSet(possibleArray[restrictAreas[j]], rule.rules.largerThan);
        }
      }
    }
    this.relax();
    this.dfs();
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
        fixed.push(key);
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
        fixed.push(this.possibleArray[areas[i]].values().next().value);
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

  relaxRule(rule, origin) {
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
    }

    for(const rules of ruleSet) {
      const result = this.relaxRule(this.globalRules[rules], origin);
      if(result === -1)return -1;
    }
    return 1;
  };

  print() {
    const result = [];
      let answer = "";
      let temp = [];
      for(let i = 0; i < this.possibleArray.length; i++) {
        const number = this.possibleArray[i].values().next().value;
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
      $('#sudokuAnswer').html(answer);
  }

  relax() {
    for (let i = 0; i < this.globalRules.groupRules.length; i++) {
      const rule = this.globalRules[this.globalRules.groupRules[i]];
      this.relaxRule(rule, [], i);
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
      const currentSetSize = this.possibleArray[i].size;
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

  dfs() {
    const smallestGridIndex = this.getSmallestGrid();
    if(smallestGridIndex === -1) {
      this.print();
      return -1;
    }
    const set = this.possibleArray[smallestGridIndex];

    for (const item of set.values()) {
      const origin = [];
      origin[smallestGridIndex] = new Set(this.possibleArray[smallestGridIndex]);
      this.possibleArray[smallestGridIndex] = new Set([item]);
      if(this.connectedRules[smallestGridIndex]){
        let flag = false;
        for(let i = 0; i < this.connectedRules[smallestGridIndex].length; i++) {
          const result = this.relaxRule(this.globalRules[this.connectedRules[smallestGridIndex][i]], origin, this.connectedRules[smallestGridIndex][i]);
          if(result === -1) {
            this.resumePossible(origin);
            flag = true;
            break;
          }
        }
        if (flag === true) {
          continue;
        }
      }

      const result = this.dfs();
      if(result === -1) {
        return result;
      }
      this.resumePossible(origin);
    }
    this.possibleArray[smallestGridIndex] = set;

  };

  resumePossible(origin) {
    origin.forEach((set, index) => {
      this.possibleArray[index] = set;
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