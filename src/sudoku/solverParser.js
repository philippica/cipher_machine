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
    if(restrictAreas.restrictArea.noFill) {
      const restrictArea = [];
      for(let i = 0; i < this.n*this.m; i++) {
        if(this.filledArea[i])continue;
        restrictArea.push(i);
      }
      globalRules.push({
        restrictAreas: restrictArea,
        rules,
      });
    } else if(rules.smallerThan || rules.largerThan) {
      for (let i = 0; i < restrictAreas.restrictArea.length; i++) {
        if(lineStr[0]!=='每'){
          for(const area of restrictAreas.restrictArea[i]) {
            this.filledArea[area] = true;
          }
        }
        globalFinalRules.push({
          restrictAreas: restrictAreas.restrictArea[i],
          rules,
        });
      }
    } else {
      for (let i = 0; i < restrictAreas.restrictArea.length; i++) {
        if(lineStr[0]!=='每'){
          for(const area of restrictAreas.restrictArea[i]) {
            this.filledArea[area] = true;
          }
        }
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
    }
  }

  getRules(str, start) {
    let temp;
    if (str[start] === '互') {
      return {
        isDifferent: true,
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
      } else if(str[start+1] === '黑') {
        currentPos = start+6;
        item = "black";
      } else if(str[start+1] === '白') {
        currentPos = start+6;
        item = "white";
      } else if(str[start+1] === '红') {
        currentPos = start+6;
        item = "red";
      } else if(str[start+1] === '蓝') {
        currentPos = start+6;
        item = "blue";
      }
      const result = this.parseRelativeSign(str, currentPos);
      const ret = {
          count: result
      }
      ret.count.item = item;

      return ret;
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
      const numberToken = this.getNumber(str, index);
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
        if (str[lineToken.stopPos] === '行') {
          for (let col = 0; col < this.m; col++) {
            ret.push((lineToken.value - 1) * m + col);
          }
        } else if (str[lineToken.stopPos] === '列') {
          for (let row = 0; row < this.n; row++) {
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
    } else if(str[0] === "没") { //没填的格子默认是
      return {
        stopPos: 7,
        restrictArea: {noFill: true},
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
      const numberToken = this.getNumber(str, currentPos);

      if (numberToken) {
        ret.push(numberToken.value);
        currentPos = numberToken.stopPos;
      } else if (str[currentPos] === '从') {
        const firstToken = this.getNumber(str, currentPos + 1);
        let secondToken;
        if (str[firstToken.stopPos] === '到') {
          secondToken = this.getNumber(str, firstToken.stopPos + 1);
        }
        for (let i = firstToken.value; i <= secondToken.value; i++) {
          ret.push(i);
        }
        currentPos = secondToken.stopPos+3;
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
    }
    return false;
  }
};