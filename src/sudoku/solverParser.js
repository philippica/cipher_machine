const colorMap = {
  '黑': 'black',
  '白': 'white',
  '红': 'red',
  '蓝': 'blue',
  '黄': 'yellow',
}

export class SolverParser {

  constructor(rulesList, n, m, globalRules, globalFinalRules) {
    this.n = n;
    this.m = m;
    this.filledArea = [];
    this.globalRules = globalRules;
    this.globalFinalRules = globalFinalRules;
    const lastParse = [];
    for (let i = 0; i < rulesList.length; i++) {
      const rule = rulesList[i].replace(/\s/g, '');
      if(rule[0]=='没') {
        lastParse.push(rule);
      } else {
        this.parseLine(rule);
      }
    }
    for(const rule of lastParse) {
      this.parseLine(rule);
    }
  }

  parseLine(lineStr, _globalFinalRules, _globalRules) {
    const globalFinalRules = _globalFinalRules ? _globalFinalRules:this.globalFinalRules;
    const globalRules = _globalRules ? _globalRules:this.globalRules;
    if(lineStr === "")return;
    if(this.specialRule(lineStr)) {
      return;
    }
    const restrictAreas = this.getRestrictAreas(lineStr, 0);
    const rules = this.getRules(lineStr, restrictAreas.stopPos);
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

  parseRelativeSign(str, start) {
    if (str[start] === '是') {
      return {
        set: this.getSet(str, start + 1),
      };
    } else if (str[start] === '大') {
      return {
        largerThan: this.getNumber(str, start + 2).value,
      };
    } else if (str[start] === '大' && str[start+2] === '等') {
      return {
        largerThan: this.getNumber(str, start + 4).value-1,
      };
    } else if (str[start] === '小') {
      return {
        smallerThan: this.getNumber(str, start + 2).value,
      };
    } else if (str[start] === '小' && str[start+2] === '等') {
      return {
        smallerThan: this.getNumber(str, start + 4).value+1,
      };
    } else if(str[start] === '强') { // 强制是xx
      return {
        set: this.getSet(str, start + 3),
        force: true
      };
    }
  }

  getRules(str, start) {
    let temp;
    if (str[start] === '互') {
      return {
        isDifferent: true,
      };
    } else if(str[start] === '按' && str[start+1] === '顺') { // 按顺序组成字母
      return {
        isWord: true,
      };
    } else if (temp = this.parseRelativeSign(str, start)) {
      return temp
    } else if(str[start] === '的' && str[start+1] === '和') {
      return {
        sum: this.getNumber(str, start + 3).value,
      };
    } else if(str[start] === '的' && str[start+1] === '系') {
      const coefficient = this.getNumberList(str, start+4);
      const number = this.getNumber(str, coefficient.stopPos+6);
      return {
        linear: {
          coefficient: coefficient.set.map(x => x+1),
          result: number.value
        }
      };
    } else if(str[start] === '的') { // 的（黑格/1/2/3）的数量(是)
      const lineToken = this.getNumber(str, start+1);
      let currentPos;
      let item;
      if(lineToken) {
        currentPos = lineToken.stopPos+3;
        item = lineToken.value;
      } else {
        currentPos = start+6;
        item = colorMap[str[start+1]];
      };
      const result = this.parseRelativeSign(str, currentPos);
      const ret = {
          count: result
      }
      ret.count.item = item;

      return ret;
    } else if(str[start] === '从') {//从上到下连续的黑格长度是
      const list = this.getNumberList(str, start + 12).set.map((x)=>x+1);
      const type = str[start+1] === '上' ? 'col' : 'row';
      return {
        bars: {
          list,
          type,
          item: colorMap[str[start+7]]
        }
      }
    } else if (str[start] === '除') {//除了黑格外的格子是
      const list = this.getNumberList(str, start + 9).set;
      return {
        permutation: {
          list
        }
      }
    }
  };

  getNumber(str, start) {
    const number = str.substr(start).match(/^\-*\d+/);
    if (!number) return null;
    return {
      value: parseInt(number[0]),
      stopPos: start + number[0].length,
    };
  };

  getNumberList(str, start) {
    let index = start + 1;
    const ret = [];
    while (1) {
      let numberToken = this.getNumber(str, index);
      if(numberToken) {
        index = numberToken.stopPos + 1;
        ret.push(numberToken.value - 1);
      } else {
        const start = index;
        while(str[index] != ']' && str[index] != ',') {
          index++;
        }
        ret.push(str.slice(start, index));
        numberToken = {stopPos: index}
        index++;
      }
      if (str[numberToken.stopPos] === ']') {
        return {
          stopPos: numberToken.stopPos + 1,
          set: ret,
        };
      }
    }
  };

  getOriginAreas(str, start) {
    const ret = [];
    if (str[0] === '每') {
      if (str.substr(1, 2) === '一行') {
        for (let row = 0; row < this.n; row++) {
          ret.push([]);
          for (let col = 0; col < this.m; col++) {
            ret[row].push(row * this.m + col);
          }
        }
        return {
          stopPos: 3,
          restrictArea: ret,
        };
      } else if (str.substr(1, 2) === '一列') {
        for (let col = 0; col < this.n; col++) {
          ret.push([]);
          for (let row = 0; row < this.m; row++) {
            ret[col].push(row * this.m + col);
          }
        }
        return {
          stopPos: 3,
          restrictArea: ret,
        };
      } else if (str.substr(1, 2) === '一格') {
        for (let row = 0; row < this.n; row++) {
          for (let col = 0; col < this.m; col++) {
            ret.push(row * this.m + col);
          }
        }
        return {
          stopPos: 3,
          restrictArea: [ret],
        };
      }
    } else if (str[0] === '第') {
      const lineToken = this.getNumber(str, 1);
      if (lineToken) {
        this.filledArea[lineToken.value - 1] = true;
        if (str[lineToken.stopPos] === '行') {
          for (let col = 0; col < this.m; col++) {
            this.filledArea[(lineToken.value - 1) * m + col] = true;
            ret.push((lineToken.value - 1) * m + col);
          }
        } else if (str[lineToken.stopPos] === '列') {
          for (let row = 0; row < this.n; row++) {
            this.filledArea[row * this.m + (lineToken.value - 1)] = true;
            ret.push(row * this.m + (lineToken.value - 1));
          }
        } else if (str[lineToken.stopPos] === '格') {
          ret.push(lineToken.value - 1);
        }
      } else if (str[start + 1] === '[') {
        const list = this.getNumberList(str, start + 1);
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

  getDir(str, start) {
    if(str[start] === '本') { // 本格
      return {
        stopPos: start+2,
        diff: {
          dr: 0,
          dc: 0
        }
      }
    }
    let currentPos = start;
    let dr = 0;
    let dc = 0;
    while(1) {
      let flag = 0;
      switch(str[currentPos]) {
      case '上':
        dr--;
        break;
      case '下':
        dr++;
        break;
      case '左':
        dc--;
        break;
      case '右':
        dc++;
        break;
      default:
        flag = 1;
      }
      if(flag === 1)break;
      currentPos++;
    }
    return {
      stopPos: currentPos,
      diff: {
        dr,
        dc
      }
    }
  }

  modifyArea(str, start, origin) {
    if(str[start] === '[') {
      let currentPos = start + 1;
      const diffs = [];
      while(1) {
        const result = this.getDir(str, currentPos);
        diffs.push(result.diff);
        currentPos = result.stopPos + 1;
        if(str[result.stopPos] === ']')break;
      }
      return {diffs, stopPos: currentPos};
    }
  }


  getRestrictAreas(str, start) {
    const ret = this.getOriginAreas(str, start);
    console.info(str[ret.stopPos]);
    if(str[ret.stopPos] === "的" && str[ret.stopPos+1] !== "和" && str[ret.stopPos + 1] !== "系") {
      let result = this.modifyArea(str, ret.stopPos +1, ret);
      const modifiedArea = ret.restrictArea[0].map((x) => {
        let c = x % this.m;
        let r = parseInt(x / this.m);
        const temp = [];
        for(const d of result.diffs) {
          const nc = c+d.dc;
          const nr = r+d.dr;
          if(nc < 0 || nc >= this.m || nr < 0 || nr >= this.n)continue;
          temp.push(nr*this.m+nc);
        }
        return temp;
      });
      ret.restrictArea = modifiedArea;
      ret.stopPos = result.stopPos;
      console.info(modifiedArea);
    }
    return ret;
  }


  getSet(str, start) {
    const ret = [];
    let currentPos = start;
    while(1) {
      if(!str[currentPos])break;
      const numberToken = this.getNumber(str, currentPos);

      if (numberToken) {
        ret.push(numberToken.value);
        currentPos = numberToken.stopPos;
      } else if (str[currentPos] === '从') {
        let firstToken = this.getNumber(str, currentPos + 1);
        let secondToken;
        if(firstToken === null) {
          firstToken = str[currentPos + 1];
          if (str[currentPos+2] === '到') {
            secondToken = str[currentPos + 3];
          }
          for(let i = firstToken.charCodeAt(0); i <= secondToken.charCodeAt(0); i++) {
            ret.push(String.fromCharCode(i).toLowerCase());
          }
          currentPos += 4;
        } else {
          if (str[firstToken.stopPos] === '到') {
            secondToken = this.getNumber(str, firstToken.stopPos + 1);
          }
          for (let i = firstToken.value; i <= secondToken.value; i++) {
            ret.push(i);
          }
          currentPos = secondToken.stopPos+3;
        }

      } else if (str[currentPos] === '或') {
        currentPos++;
      } else if(str[currentPos] === '黑') {
        ret.push('black');
        currentPos += 2;
      } else if(str[currentPos] === '白') {
        ret.push('white');
        currentPos += 2;
      } else if(str[currentPos] === '红') {
        ret.push('red');
        currentPos += 2;
      } else if(str[currentPos] === '蓝') {
        ret.push('blue');
        currentPos += 2;
      } else if(str[currentPos].match(/[a-z]/i)) {
        ret.push(str[currentPos]);
        currentPos += 1;
      } else {
        break;
      }
    }
    return ret;
  };

  specialRule(lineStr) {
    if(lineStr[0] === '我') {
      return true;
    } else if (lineStr[0] === '如') {
      const regexResult = lineStr.match(/^如果(?<ifCondition>(?<![,，]).*),那么(?<statement>.*)/).groups;
      const condition = regexResult.ifCondition;
      const statement = regexResult.statement;
      if(condition === undefined || statement === undefined) {
        alert(lineStr + "不符合如果这条规则的规范");
      }
      const conditionResult = [];
      this.parseLine(condition, conditionResult, conditionResult);
      const statementResult = [];
      this.parseLine(statement, statementResult, statementResult);
      for(const rule of conditionResult) {
        const dummyRule = {
          restrictAreas: rule.restrictAreas,
          rules: {
            ifCondition: {
              condition: rule.rules,
              statement: statementResult
            }
          }
        }
        this.globalRules.push(dummyRule);
      }

      return true;
    } else if(lineStr[0] === '没') { //没填的格子默认是"第<格子序号>格的[本格,上,下,左,右,左上,右上,左下,右下]的黑格的数量是0"
      let content = lineStr.substr(9);
      content = content.substr(0, content.length-1);
      console.info(content);

      for(let i = 0; i < this.n*this.m; i++) {
        if(this.filledArea[i])continue;
        const contentSubstitue = content.replace("<格子序号>", (i+1).toString())
        console.info(contentSubstitue);
        this.parseLine(contentSubstitue);
      }

      return true;
    }
    return false;
  }
};