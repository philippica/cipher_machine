class BigInteger {
  static _base = 10;
  // In rowDec, there's a _base^compressDegree base number
  static compressDegree = 4;
  static realBase = this._base ** this.compressDegree;
  constructor(num) {
    this.rawDec = [];
    this.positive = true;
    if (num) {
      this.parse(num);
    }
  }


  parseNumber(_num) {
    let num = _num;
    this.rawDec = [];
    while (num !== 0) {
      this.rawDec.push(num % BigInteger.realBase);
      num = parseInt(num / BigInteger.realBase, BigInteger._base);
    }
  }

  parseString(_numStr) {
    const numStr = this.trimLeadingZero(_numStr);
    this.rawDec = [];
    let numIndex = numStr.length - 1;
    let rawDecIndex = 0;
    while (numIndex >= 0) {
      this.rawDec.push(0);
      rawDecIndex = this.rawDec.length - 1;

      for (let i = BigInteger.compressDegree - 1; i >= 0; i--) {
        this.rawDec[rawDecIndex] = this.rawDec[rawDecIndex] * BigInteger._base + parseInt(numStr[numIndex - i] ?? 0, BigInteger._base);
      }

      numIndex -= BigInteger.compressDegree;
    }
  }

  parse(num) {
    if (Array.isArray(num)) {
      this.rawDec = num;
      return;
    }
    switch (typeof (num)) {
      case 'number':
        this.parseNumber(num);
        break;
      case 'string':
        this.parseString(num);
        break;
      default:
        break;
    }
  }

  trimLeadingZero(numStr) {
    return numStr.replace(/^0+/, '');
  }

  toString() {
    const rawDecDummy = this.rawDec.slice(0);
    let result = '';
    while (rawDecDummy.length > 0) {
      let currentSegment = rawDecDummy.pop();
      let temp = '';
      for (let i = 0; i < BigInteger.compressDegree; i++) {
        const digit = currentSegment % BigInteger._base;
        temp = digit.toString() + temp;
        currentSegment = parseInt(currentSegment / BigInteger._base, BigInteger._base);
      }
      result += temp;
    }
    result = this.trimLeadingZero(result);
    if (this.positive === false) {
      result = `-${result}`;
    }
    return result;
  }
  inverse() {
    this.positive = !this.positive;
  }

  linearOp(_num, op, nextCarry, isSwap) {
    let num = _num;
    const result = [];
    if (typeof (_num) === 'number' || typeof (_num) === 'string') {
      num = new BigInteger(_num);
    }
    let carry = 0;
    let selfArray = this.rawDec;
    let anotherArray = num.rawDec;
    if (isSwap) {
      const temp = selfArray;
      selfArray = anotherArray;
      anotherArray = temp;
    }
    for (let i = 0; i < selfArray.length || i < anotherArray.length; i++) {
      const segmentSelf = selfArray[i] ?? 0;
      const segmentAnother = anotherArray[i] ?? 0;
      const segmentResult = op(segmentSelf, segmentAnother, carry) % BigInteger.realBase;
      result.push(segmentResult);
      carry = nextCarry(op(segmentSelf, segmentAnother, carry));
    }
    result.push(carry);
    return new BigInteger(result);
  }
  add(_num) {
    return this.linearOp(_num, (first, second, carry) => first + second + carry, num => (num >= BigInteger.realBase ? 1 : 0));
  }
  minus(_num) {
    const isSwap = !this.largerThan(_num);
    const result = this.linearOp(_num, (first, second, carry) => first - second - carry, num => (num < 0 ? 1 : 0), isSwap);
    if (isSwap) {
      result.inverse();
    }
    return result;
  }
  multiply(_num) {
    // TODO: FFT
    let num = _num;
    if (typeof (_num) === 'number' || typeof (_num) === 'string') {
      num = new BigInteger(_num);
    }
    const result = [];
    for (let i = 0; i < num.rawDec.length; i++) {
      for (let j = 0; j < this.rawDec.length; j++) {
        if (result[i + j] === undefined) {
          result.push(0);
        }
        const tempResult = result[i + j] + num.rawDec[i] * this.rawDec[j];
        result[i + j] = tempResult % BigInteger.realBase;
        const carry = parseInt(tempResult / BigInteger.realBase, 10);
        if (carry) {
          if (result[i + j + 1] === undefined) {
            result.push(0);
          }
          result[i + j + 1] += carry;
        }
      }
    }
    return new BigInteger(result);
  }
  largerThan(_num) {
    let num = _num;
    if (typeof (_num) === 'number' || typeof (_num) === 'string') {
      num = new BigInteger(_num);
    }
    if (num.rawDec.length !== this.rawDec.length) {
      return (this.rawDec.length > num.rawDec.length);
    }
    for (let i = num.rawDec.length; i >= 0; i--) {
      if (this.rawDec[i] !== num.rawDec[i]) {
        return this.rawDec[i] > num.rawDec[i];
      }
    }
    return false;
  }
}
