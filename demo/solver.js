
$('#rules').val('每一格是从1到9的数字\n每一行互不相同\n第1列互不相同\n第[1,3,4]格互不相同\n第1格是1');
const rulesStr = $('#rules').val().split('\n');

const n = 9;
const m = 9;
const possibleArray = [];
const connectedRules = [];

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

const getRules = (str, start) => {
  if (str[start] === '互') {
    return {
      isDifferent: true,
    };
  } else if (str[start] === '是') {
    return {
      set: getSet(str, start + 1),
    };
  }
};

const globalRules = [];
const parseLine = (lineStr) => {
  console.info(lineStr);
  const restrictAreas = getRestrictAreas(lineStr, 0);
  const rules = getRules(lineStr, restrictAreas.stopPos);
  for (let i = 0; i < restrictAreas.restrictArea.length; i++) {
    globalRules.push({
      restrictAreas: restrictAreas.restrictArea[i],
      rules,
    });
  }
};

const relaxRule = (rule) => {
  const getDifference = (setA, setB) => new Set([...setA, ...setB].filter(element => !setB.has(element) || !setA.has(element)));
  if (rule.rules.isDifferent) {
    console.info(rule);
    const fixed = [];
    const areas = rule.restrictAreas;
    for (let i = 0; i < areas.length; i++) {
      if (possibleArray[areas[i]].size === 1) {
        fixed.push(possibleArray[areas[i]].values().next().value);
      }
    }
    let diff = possibleArray[areas[0]];
    for (let i = 1; i < areas.length; i++) {
      diff = getDifference(diff, possibleArray[areas[i]]);
    }
    for (let j = 0; j < fixed.length; j++) {
      for (let i = 0; i < areas.length; i++) {
        const possibleList = possibleArray[areas[i]];
        if (possibleList.has(fixed[j]) && possibleList.size > 1) {
          possibleList.delete(fixed[j]);
          if (possibleList.size === 1) {
            fixed.push(possibleList.values().next().value);
          }
        }
      }
    }
  }
};

const relax = () => {
  for (let i = 0; i < globalRules.groupRules.length; i++) {
    const rule = globalRules[globalRules.groupRules[i]];
    relaxRule(rule);
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

const dfs = (grid) => {
  console.info(grid);
  console.info(possibleArray);
};


const main = () => {
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
    const letterSet = rule.rules?.set;
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
  relax();
  dfs();
};


main();

