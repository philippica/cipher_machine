// TODO: Need to be refacted, the code here is tooooo terrible
let n;
let m;
let possibleArray = [];
let connectedRules = [];

const getNumber = (str, start) => {
  const number = str.substr(start).match(/^\d+/);
  if (!number) return null;
  return {
    value: parseInt(number[0]),
    stopPos: start + number[0].length,
  };
};

const getNumberList = (str, start) => {
  let index = start + 1;
  const ret = [];
  while (1) {
    const numberToken = getNumber(str, index);
    index = numberToken.stopPos + 1;
    ret.push(numberToken.value - 1);
    if (str[numberToken.stopPos] === ']') {
      return {
        stopPos: numberToken.stopPos + 1,
        set: ret,
      };
    }
  }
};

const getRestrictAreas = (str, start) => {
  const ret = [];
  if (str[0] === '每') {
    if (str.substr(1, 2) === '一行') {
      for (let row = 0; row < n; row++) {
        ret.push([]);
        for (let col = 0; col < m; col++) {
          ret[row].push(row * m + col);
        }
      }
      return {
        stopPos: 3,
        restrictArea: ret,
      };
    } else if (str.substr(1, 2) === '一列') {
      for (let col = 0; col < n; col++) {
        ret.push([]);
        for (let row = 0; row < m; row++) {
          ret[col].push(row * m + col);
        }
      }
      return {
        stopPos: 3,
        restrictArea: ret,
      };
    } else if (str.substr(1, 2) === '一格') {
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < m; col++) {
          ret.push(row * m + col);
        }
      }
      return {
        stopPos: 3,
        restrictArea: [ret],
      };
    }
  } else if (str[0] === '第') {
    const lineToken = getNumber(str, 1);
    if (lineToken) {
      if (str[lineToken.stopPos] === '行') {
        for (let col = 0; col < m; col++) {
          ret.push((lineToken.value - 1) * m + col);
        }
      } else if (str[lineToken.stopPos] === '列') {
        for (let row = 0; row < n; row++) {
          ret.push(row * m + (lineToken.value - 1));
        }
      } else if (str[lineToken.stopPos] === '格') {
        ret.push(lineToken.value - 1);
      }
    } else if (str[start + 1] === '[') {
      const list = getNumberList(str, start + 1);
      return {
        stopPos: list.stopPos + 1,
        restrictArea: [list.set],
      };
    }
    return {
      stopPos: lineToken.stopPos + 1,
      restrictArea: [ret],
    };
  }
};


const getSet = (str, start) => {
  const numberToken = getNumber(str, start);

  if (numberToken) {
    return [numberToken.value];
  }
  if (str[start] === '从') {
    const firstToken = getNumber(str, start + 1);
    let secondToken;
    if (str[firstToken.stopPos] === '到') {
      secondToken = getNumber(str, firstToken.stopPos + 1);
    }
    const ret = [];
    for (let i = firstToken.value; i <= secondToken.value; i++) {
      ret.push(i);
    }
    return ret;
  }
};

const print = () => {
  const result = [];
    let answer = "";
    let temp = [];
    for(let i = 0; i < possibleArray.length; i++) {
      const number = possibleArray[i].values().next().value;
      temp.push(number);
      answer += number + ' ';
      if(i % m === m-1) {
        result.push(temp);
        answer += '\n';
        temp = [];
      }
    }
    console.info(result);
    console.info(answer);
    $('#sudokuAnswer').html(answer);
}

const getRules = (str, start) => {
  if (str[start] === '互') {
    return {
      isDifferent: true,
    };
  } else if (str[start] === '是') {
    return {
      set: getSet(str, start + 1),
    };
  } else if (str[start] === '大') {
    return {
      largerThan: getNumber(str, start + 2).value,
    };
  } else if (str[start] === '大' && str[start+2] === '等') {
    return {
      largerThan: getNumber(str, start + 4).value-1,
    };
  } else if (str[start] === '小') {
    return {
      smallerThan: getNumber(str, start + 2).value,
    };
  } else if (str[start] === '小' && str[start+2] === '等') {
    return {
      smallerThan: getSet(str, start + 4).value+1,
    };
  } else if(str[start] === '的' && str[start+1] === '和') {
    return {
      sum: getNumber(str, start + 3).value,
    };
  } else if(str[start] === '的' && str[start+1] === '系') {
    return {
      sum: getNumber(str, start + 3).value,
    };
  }
};

let globalRules = [];
let globalFinalRules = [];
const parseLine = (lineStr) => {
  if(lineStr === "")return;
  const restrictAreas = getRestrictAreas(lineStr, 0);
  const rules = getRules(lineStr, restrictAreas.stopPos);
  if(rules === undefined) {
    alert(`我不认识"${lineStr}"的规则，请仔细检查`);
    return;
  }
  if(rules.smallerThan || rules.largerThan) {
    for (let i = 0; i < restrictAreas.restrictArea.length; i++) {
      globalFinalRules.push({
        restrictAreas: restrictAreas.restrictArea[i],
        rules,
      });
    }
  } else {
    for (let i = 0; i < restrictAreas.restrictArea.length; i++) {
      globalRules.push({
        restrictAreas: restrictAreas.restrictArea[i],
        rules,
      });
    }
  }
};

const relaxRule = (rule, origin) => {
  const getDifference = (setA, setB) => new Set([...setA, ...setB].filter(element => !setB.has(element) || !setA.has(element)));
  const ruleSet = new Set([]);
  const areas = rule.restrictAreas;
  if (rule.rules.isDifferent) {
    let fixed = [];

    const mp = new Map();

    for (let i = 0; i < areas.length; i++) {
	    const possibleList = [...possibleArray[areas[i]]];
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
          if (possibleArray[areas[i]].has(key) && possibleArray[areas[i]].size > 1) {
            if(!origin[areas[i]]) {
              origin[areas[i]] = new Set(possibleArray[areas[i]]);
            }
            possibleArray[areas[i]] = new Set([key]);
            for(const connectedRule of connectedRules[areas[i]]) {
              ruleSet.add(connectedRule);
            }
          }
        }
      }
    });

    for (let i = 0; i < areas.length; i++) {
      if (possibleArray[areas[i]].size === 1) {
        fixed.push(possibleArray[areas[i]].values().next().value);
      }
    }

    for (let j = 0; j < fixed.length; j++) {
      for (let i = 0; i < areas.length; i++) {
        const possibleList = possibleArray[areas[i]];
        if (possibleList.has(fixed[j]) && possibleList.size > 1) {
          if(!origin[areas[i]]) {
            origin[areas[i]] = new Set(possibleList);
          }
          possibleList.delete(fixed[j]);
          if (possibleList.size === 0) {
            console.info("No");
            return -1;
          }
          for(const connectedRule of connectedRules[areas[i]]) {
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
      if (possibleArray[areas[i]].size === 1) {
        const number = possibleArray[areas[i]].values().next().value;
        if(fixed.includes(number)) {
          return -1;
        }
        fixed.push(number);
      }

    }
  } else if (rule.rules.sum) {
    const sum = rule.rules.sum;

    let currentSum = undefined;
    let currentSum2 = 0;
    let fixedCount = areas.length;
    let unknowList = 0;
    for (let i = 0; i < areas.length; i++) {
	    const possibleList = [...possibleArray[areas[i]]];
      if(possibleList.length === 0) {
        return -1;
      }
      if(possibleList.length > 1) {
        unknowList = areas[i];
        currentSum = undefined;
        break;
      }
      currentSum = currentSum?currentSum+possibleList[0] : possibleList[0];
      fixedCount--;
      currentSum2 += possibleList[0];
    }
    if(currentSum !== undefined && currentSum !== sum) {
      return -1;
    }
    if(fixedCount === 1) {
      if(possibleArray[unknowList].has(sum - currentSum2)) {
        if(!origin[unknowList]) {
          origin[unknowList] = new Set(possibleList);
        }
        for(const connectedRule of connectedRules[unknowList]) {
          ruleSet.add(connectedRule);
        }
        possibleArray[unknowList] = new Set([sum - currentSum2]);
      } else {
        return -1;
      }
    }
  }

  for(const rules of ruleSet) {
    const result = relaxRule(globalRules[rules], origin);
    if(result === -1)return -1;
  }
  return 1;
};

const relax = () => {
  for (let i = 0; i < globalRules.groupRules.length; i++) {
    const rule = globalRules[globalRules.groupRules[i]];
    relaxRule(rule, [], i);
  }
};

const mergeSet = (pos, set) => {
  const getIntersection = (setA, setB) => new Set(setB.filter(element => setA.has(element)));
  if (possibleArray[pos] === undefined) {
    possibleArray[pos] = new Set(set);
  } else {
    possibleArray[pos] = getIntersection(possibleArray[pos], set);
  }
};

const getSmallestGrid = () => {
  let smallestGridIndex = -1;
  let smallestGridSize = 128;
  for(let i = 0; i < possibleArray.length; i++) {
    const currentSetSize = possibleArray[i].size;
    if(currentSetSize === 1)continue;
    if(currentSetSize < smallestGridSize) {
      smallestGridSize = currentSetSize;
      smallestGridIndex = i;
    }
    if(smallestGridSize === 2) {
      return smallestGridIndex;
    }
  }
  return smallestGridIndex;
}

const resumePossible = (origin) => {
  origin.forEach((set, index) => {
    possibleArray[index] = set;
  });
}


const dfs = () => {
  const smallestGridIndex = getSmallestGrid();
  if(smallestGridIndex === -1) {
    print();
    return -1;
  }
  const set = possibleArray[smallestGridIndex];

  for (const item of set.values()) {
    const origin = [];
    origin[smallestGridIndex] = new Set(possibleArray[smallestGridIndex]);
    possibleArray[smallestGridIndex] = new Set([item]);
    if(connectedRules[smallestGridIndex]){
      let flag = false;
      for(let i = 0; i < connectedRules[smallestGridIndex].length; i++) {
        const result = relaxRule(globalRules[connectedRules[smallestGridIndex][i]], origin, connectedRules[smallestGridIndex][i]);
        if(result === -1) {
          resumePossible(origin);
          flag = true;
          break;
        }
      }
      if (flag === true) {
        continue;
      }
    }

    const result = dfs();
    if(result === -1) {
      return result;
    }
    resumePossible(origin);
  }
  possibleArray[smallestGridIndex] = set;

};
const largerSet = (list, num) => {
  const ret = new Set([]);
  for(const x of list) {
    if(x > num) {
      ret.add(x);
    }
  }
  return ret;
}

const smallSet = (list, num) => {
  const ret = new Set([]);
  for(const x of list) {
    if(x < num) {
      ret.add(x);
    }
  }
  return ret;
}


export class Sudoku {
    constructor() {
    }
    sovler(rulesStr, row, col) {
        n = row;
        m = col;
        possibleArray = [];
        connectedRules = [];
        globalRules = [];
        globalFinalRules = [];
        for (let i = 0; i < rulesStr.length; i++) {
          parseLine(rulesStr[i].replace(/\s/g, ''));
        }
        for (let i = 0; i < n * m; i++) {
          possibleArray.push(undefined);
          connectedRules.push([]);
        }
      
        globalRules.descriptionRules = [];
        globalRules.groupRules = [];
        for (let i = 0; i < globalRules.length; i++) {
          const rule = globalRules[i];
          const { restrictAreas } = rule;
          const letterSet = rule.rules? rule.rules.set : undefined;
          if (letterSet) {
            globalRules.descriptionRules.push(i);
            for (let j = 0; j < restrictAreas.length; j++) {
              mergeSet(restrictAreas[j], letterSet);
            }
          } else {
            globalRules.groupRules.push(i);
            for (let j = 0; j < restrictAreas.length; j++) {
              connectedRules[restrictAreas[j]].push(i);
            }
          }
        }
      
        for (let i = 0; i < globalFinalRules.length; i++) {
          const rule = globalFinalRules[i];
          const { restrictAreas } = rule;
          if (rule.rules && rule.rules.largerThan) {
            for (let j = 0; j < restrictAreas.length; j++) {
              possibleArray[restrictAreas[j]] = largerSet(possibleArray[restrictAreas[j]], rule.rules.largerThan);
            }
          } else if(rule.rules && rule.rules.smallerThan) {
            for (let j = 0; j < restrictAreas.length; j++) {
              possibleArray[restrictAreas[j]] = smallSet(possibleArray[restrictAreas[j]], rule.rules.largerThan);
            }
          }
        }
        relax();
        dfs();
    }
};
