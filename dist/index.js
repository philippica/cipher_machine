/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Substitution"] = factory();
	else
		root["Substitution"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./MappingTable.js":
/*!*************************!*\
  !*** ./MappingTable.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MappingTable\": () => (/* binding */ MappingTable)\n/* harmony export */ });\nclass MappingTable {\r\n\tstatic guessPossible   = 3;\r\n\tstatic guessImpossible = 2;\r\n\tstatic possible        = 1;\r\n\tstatic impossible      = 0;\r\n\tconstructor() {\r\n\t\tthis.mode = MappingTable.impossible;\r\n\t\tthis.matrix = new Array(26);\r\n\t\tthis.ensure = new Array(26);\r\n\t\tfor(let i = 0; i < 26; i++) {\r\n\t\t\tthis.matrix[String.fromCharCode(97 + i)] = new Array(26);\r\n\t\t\tlet curCol = this.matrix[String.fromCharCode(97 + i)];\r\n\t\t\tfor(let j = 0; j < 26; j++) {\r\n\t\t\t\tcurCol[String.fromCharCode(97 + j)] = MappingTable.possible;\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\r\n\tinit() {\r\n\t\tthis.matrix = new Array(26);\r\n\t\tthis.ensure = new Array(26);\r\n\t\tfor(let i = 0; i < 26; i++) {\r\n\t\t\tthis.matrix[String.fromCharCode(97 + i)] = new Array(26);\r\n\t\t\tlet curCol = this.matrix[String.fromCharCode(97 + i)];\r\n\t\t\tfor(let j = 0; j < 26; j++) {\r\n\t\t\t\tcurCol[String.fromCharCode(97 + j)] = MappingTable.possible;\r\n\t\t\t}\r\n\t\t}\r\n\t\tthis.mode = MappingTable.impossible;\r\n\t}\r\n\r\n\tdisallow(oriChar, matchedChar) {\r\n\t\tconst isChanged = this.matrix[oriChar][matchedChar] !== this.mode;\r\n\t\tthis.matrix[oriChar][matchedChar] = this.mode;\r\n\t\treturn isChanged;\r\n\t}\r\n\r\n\tunique(ch) {\r\n\t\tlet count = 0;\r\n\t\tfor(let i = 0; i < 26; i++) {\r\n\t\t\tif(this.matrix[ch][String.fromCharCode(97 + i)] === MappingTable.possible) {\r\n\t\t\t\tthis.ensure[ch] = String.fromCharCode(97 + i);\r\n\t\t\t\tcount++;\r\n\t\t\t\tif(count > 1) {\r\n\t\t\t\t\tthis.ensure[ch] = null;\r\n\t\t\t\t\treturn false;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn true;\r\n\t}\r\n\r\n\tgetAllowedChars(oriChar) {\r\n\t\tconst ret = new Array();\r\n\t\tfor(let i = 0; i < 26; i++) {\r\n\t\t\tif(this.matrix[oriChar][String.fromCharCode(97 + j)] !== MappingTable.impossible) {\r\n\t\t\t\tret.push(String.fromCharCode(97 + j));\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn ret;\r\n\t}\r\n\r\n\tisAllowed(oriChar, matchedChar) {\r\n\t\treturn this.matrix[oriChar][matchedChar];\r\n\t}\r\n\r\n\tmapMode(mode) {\r\n\t\tthis.mode = mode;\r\n\t}\r\n\t\r\n\tcopy() {\r\n\t\tconst ret = new MappingTable();\r\n\t\tret.ensure = [].concat(this.ensure);\r\n\t\tfor(let i = 0; i < 26; i++) {\r\n\t\t\tfor(let j = 0 ; j < 26; j++) {\r\n\t\t\t\tret.matrix[String.fromCharCode(97 + i)][String.fromCharCode(97 + j)] = this.matrix[String.fromCharCode(97 + i)][String.fromCharCode(97 + j)]\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn ret;\r\n\t}\r\n}\r\n\n\n//# sourceURL=webpack://Substitution/./MappingTable.js?");

/***/ }),

/***/ "./Token.js":
/*!******************!*\
  !*** ./Token.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Token\": () => (/* binding */ Token)\n/* harmony export */ });\n/* harmony import */ var _MappingTable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MappingTable */ \"./MappingTable.js\");\n\r\n\r\nclass Token {\r\n    constructor(word, possibleList, position) {\r\n        this.word = word; \r\n        this.possibleList = JSON.parse(JSON.stringify(possibleList)); \r\n        this.position = position;\r\n    }\r\n\r\n    eliminate(mappingTable) {\r\n\t\tvar len = this.word.length,\r\n\t\t    possibleListLen = this.possibleList.length,\r\n\t\t    deleteList = new Array(),\r\n\t\t\tflag = false;\r\n\t\t// For each possible word, delete it if it's letter is not matched.\r\n\t\tfor(var i = 0; i < possibleListLen; i++) {\r\n\t\t\tvar possibleWord = this.possibleList[i];\r\n\t\t\tif(possibleWord === undefined) {\r\n\t\t\t\tdeleteList[i] = 1;\r\n\t\t\t\tcontinue;\r\n\t\t\t}\r\n\t\t\tfor(var j = 0; j < len; j++) {\t\t\t\r\n\t\t\t\tif(mappingTable.isAllowed(this.word[j], possibleWord[j]) === _MappingTable__WEBPACK_IMPORTED_MODULE_0__.MappingTable.impossible) {\r\n\t\t\t\t\tdeleteList[i] = 1;\r\n\t\t\t\t\tflag = true;\r\n\t\t\t\t\tbreak;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\tfor(var i = possibleListLen - 1; i >= 0; i--) {\r\n\t\t\tif(deleteList[i] === 1) {\r\n\t\t\t\tthis.possibleList.splice(i, 1);\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn flag;\r\n\t}\r\n    trimMappingTable(mappingTable) {\r\n\t\tvar len = this.word.length,\r\n\t\t\tpossibleListLen = this.possibleList.length,\r\n\t\t\tpossibleLetters = new Array(26),\r\n\t\t\tflag = false;\r\n\t\tfor(var i = 0; i < len; i++) {\r\n\t\t\tfor(var j = 0; j < 26; j++) {\r\n\t\t\t\tpossibleLetters[j] = _MappingTable__WEBPACK_IMPORTED_MODULE_0__.MappingTable.impossible;\r\n\t\t\t}\r\n\t\t\tvar curLetter = this.word[i];\r\n\t\t\tfor(var j = 0; j < possibleListLen; j++) {\r\n\t\t\t\tpossibleLetters[this.possibleList[j].charCodeAt(i) - 97] = _MappingTable__WEBPACK_IMPORTED_MODULE_0__.MappingTable.possible;\r\n\t\t\t}\r\n\t\t\tfor(var j = 0; j < 26; j++) {\r\n\t\t\t\tif(possibleLetters[j] !== _MappingTable__WEBPACK_IMPORTED_MODULE_0__.MappingTable.possible) {\r\n\t\t\t\t\tconst isChanged = mappingTable.disallow(this.word[i], String.fromCharCode(97 + j));\r\n\t\t\t\t\tflag = flag || isChanged;\r\n\t\t\t\t}\r\n\t\t\t}\r\n \t\t\tif(mappingTable.unique(curLetter) === true) {\r\n\t\t\t\tconst ensureLetter = mappingTable.ensure[curLetter];\r\n\t\t\t\tfor(var j = 0; j < 26; j++) {\r\n\t\t\t\t\tif(curLetter === String.fromCharCode(j + 97)){\r\n\t\t\t\t\t\tcontinue;\r\n\t\t\t\t\t}\r\n\t\t\t\t\tconst isChanged = mappingTable.disallow(String.fromCharCode(97 + j), ensureLetter);\r\n\t\t\t\t\tflag = isChanged || flag;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn flag;\r\n    }\r\n    customize(mappingTable) {\r\n\t\tlet isEliminated = this.eliminate(mappingTable);\r\n\t\tlet isTrimed = this.trimMappingTable(mappingTable);\r\n\t\treturn isEliminated || isTrimed;\r\n\t}\r\n    copy() {\r\n\t\tvar ret = new Token(this.word, this.possibleList, this.position);\r\n\t\treturn ret;\r\n\t}\r\n}\r\n\n\n//# sourceURL=webpack://Substitution/./Token.js?");

/***/ }),

/***/ "./dict.js":
/*!*****************!*\
  !*** ./dict.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _substitution__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./substitution */ \"./substitution.js\");\n\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_substitution__WEBPACK_IMPORTED_MODULE_0__.SubstitutionSolver);\r\n\n\n//# sourceURL=webpack://Substitution/./index.js?");

/***/ }),

/***/ "./substitution.js":
/*!*************************!*\
  !*** ./substitution.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SubstitutionSolver\": () => (/* binding */ SubstitutionSolver)\n/* harmony export */ });\n/* harmony import */ var _MappingTable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MappingTable */ \"./MappingTable.js\");\n/* harmony import */ var _token_list_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./token-list.js */ \"./token-list.js\");\n\r\n\r\n\r\n\r\nclass SubstitutionSolver {\r\n\tconstructor() {\r\n\t\tthis.globleAns = [];\r\n\t\tthis.ans = new Array();\r\n\t\tthis.weight = [];\r\n\t\tthis.threshold = 10;\r\n\t}\r\n\tsubstituteSolver(text, maxOutput, threshold) {\r\n\t\tthis.threshold = threshold || 10;\r\n\t\tthis.maxOutput = maxOutput || 3000;\r\n\t\tvar text = text.toLowerCase();\r\n\t\tvar rawTokens = text.split(/[^a-zA-Z0-9\\']+/);\r\n\t\tvar mappingTable = new _MappingTable__WEBPACK_IMPORTED_MODULE_0__.MappingTable();\r\n\t\tvar unknownWordsList = new _token_list_js__WEBPACK_IMPORTED_MODULE_1__.TokenList();\r\n\t\tthis.globleAns = [];\r\n\t\tthis.ans = [];\r\n\t\tvar knownWordsList = new _token_list_js__WEBPACK_IMPORTED_MODULE_1__.TokenList();\r\n\r\n\t\tunknownWordsList.build(rawTokens, knownWordsList, mappingTable, this.weight);\r\n\r\n\t\tunknownWordsList.refreshByMappintTable(knownWordsList, mappingTable);\r\n\t\r\n\t\tthis.dfsNonRecursion(unknownWordsList, knownWordsList, mappingTable);\r\n\t\t// this.dfs(unknownWordsList, knownWordsList, mappingTable);\r\n\r\n\t\tthis.globleAns.sort((a, b) => b.weight - a.weight);\r\n\t\tconsole.info(this.globleAns);\r\n\t\treturn this.globleAns.map((item)=>item.ret);\r\n\t}\r\n\r\n\toutput(answer)\r\n\t{\r\n\t\tlet ret = \"\";\r\n\t\tlet weight = 0;\r\n\t\tfor(let possibleToken of answer.list) {\r\n\t\t\tret += possibleToken.possibleList[0] + \" \";\r\n\t\t\tweight += this.weight[possibleToken.possibleList[0]];\r\n\t\t}\r\n\t\tthis.globleAns.push({ret, weight});\r\n\t}\r\n\r\n/*\r\n *\tpara:\r\n *\t\tunknownWordsList - list of unknown words, unknown means it's possiable list is greater than one\r\n *\t\tanswer - list of known words, known means the possible list of it is only one\r\n *\t\tmappingTable - it's a 26*26 table which represents letter's mapping of ct & pt\r\n *  return:\r\n *  \tvoid\r\n*/\r\n\r\n\tdfs(unknownWordsList, knownWordsList, mappingTable) {\r\n\t\tif(unknownWordsList.empty()) {\r\n\t\t\tthis.output(knownWordsList);\r\n\t\t\treturn;\r\n\t\t}\r\n\r\n\t\tconst minSizeIndex = unknownWordsList.getMinPossibleList();\r\n\t\tconst minLen = unknownWordsList.list[minSizeIndex].possibleList.length;\r\n\t\r\n\t\tfor(var i = 0; i < minLen; i++) {\r\n\t\t\tconst chooseWord = unknownWordsList.list[minSizeIndex].possibleList[i];\r\n\t\t\tconst dummyUnknownWordsList = unknownWordsList.copy();\r\n\t\t\tconst dummyAns = knownWordsList.copy();\r\n\t\t\tconst dummyMappingTable = mappingTable.copy();\r\n\r\n\t\t\tdummyUnknownWordsList.setPossibleList(minSizeIndex, chooseWord);\r\n\r\n\t\t\tif(dummyUnknownWordsList.refreshByMappintTable(dummyAns, dummyMappingTable) === false) {\r\n\t\t\t\tcontinue;\r\n\t\t\t}\r\n\t\t\tthis.dfs(dummyUnknownWordsList, dummyAns, dummyMappingTable);\r\n\t\t}\r\n\t}\r\n\r\n\tdfsNonRecursion(unknownWordsList, knownWordsList, mappingTable) {\r\n\t\tconst stack = new Array();\r\n\t\tstack.push({unknownWordsList, knownWordsList, mappingTable});\r\n\t\tlet countOfAnswer = 0;\r\n\t\tconst stack2 = new Array();\r\n\t\twhile(stack.length > 0) {\r\n\t\t\tconst state = stack.pop();\r\n\t\t\tif(state.unknownWordsList.empty()) {\r\n\t\t\t\tthis.output(state.knownWordsList);\r\n\t\t\t\tcountOfAnswer++;\r\n\t\t\t\tif(countOfAnswer > this.maxOutput) {\r\n\t\t\t\t\treturn;\r\n\t\t\t\t}\r\n\t\t\t\tcontinue;\r\n\t\t\t}\r\n\r\n\t\t\tconst minSizeIndex = state.unknownWordsList.getMinPossibleList();\r\n\t\t\tconst minLen = state.unknownWordsList.list[minSizeIndex].possibleList.length;\r\n\t\t\tconst loopLen = Math.min(minLen, this.threshold);\r\n\t\t\r\n\t\t\tfor(var i = 0; i < loopLen; i++) {\r\n\t\t\t\tconst chooseWord = state.unknownWordsList.list[minSizeIndex].possibleList[i];\r\n\t\t\t\tconst dummyUnknownWordsList = state.unknownWordsList.copy();\r\n\t\t\t\tconst dummyAns = state.knownWordsList.copy();\r\n\t\t\t\tconst dummyMappingTable = state.mappingTable.copy();\r\n\t\r\n\t\t\t\tdummyUnknownWordsList.setPossibleList(minSizeIndex, chooseWord);\r\n\t\r\n\t\t\t\tif(dummyUnknownWordsList.refreshByMappintTable(dummyAns, dummyMappingTable) === false) {\r\n\t\t\t\t\tcontinue;\r\n\t\t\t\t}\r\n\t\t\t\tstack.push({unknownWordsList: dummyUnknownWordsList, knownWordsList: dummyAns, mappingTable: dummyMappingTable});\r\n\t\t\t}\r\n\t\t\tstate.unknownWordsList.list[minSizeIndex].possibleList = state.unknownWordsList.list[minSizeIndex].possibleList.slice(loopLen);\r\n\t\t\tif(state.unknownWordsList.refreshByMappintTable(state.knownWordsList, state.mappingTable) === false) {\r\n\t\t\t\tcontinue;\r\n\t\t\t}\r\n\t\t\tstack2.push({\r\n\t\t\t\tunknownWordsList: state.unknownWordsList,\r\n\t\t\t\tknownWordsList: state.knownWordsList,\r\n\t\t\t\tmappingTable: state.mappingTable,\r\n\t\t\t});\r\n\t\t}\r\n\r\n\t\twhile(stack2.length > 0) {\r\n\t\t\tconst state = stack2.pop();\r\n\t\t\tif(state.unknownWordsList.empty()) {\r\n\t\t\t\tthis.output(state.knownWordsList);\r\n\t\t\t\tcountOfAnswer++;\r\n\t\t\t\tif(countOfAnswer > this.maxOutput) {\r\n\t\t\t\t\treturn;\r\n\t\t\t\t}\r\n\t\t\t\tcontinue;\r\n\t\t\t}\r\n\r\n\t\t\tconst minSizeIndex = state.unknownWordsList.getMinPossibleList();\r\n\t\t\tconst minLen = state.unknownWordsList.list[minSizeIndex].possibleList.length;\r\n\t\t\tconst loopLen = Math.min(minLen, this.threshold);\r\n\t\t\r\n\t\t\tfor(var i = 0; i < minLen; i++) {\r\n\t\t\t\tconst chooseWord = state.unknownWordsList.list[minSizeIndex].possibleList[i];\r\n\t\t\t\tconst dummyUnknownWordsList = state.unknownWordsList.copy();\r\n\t\t\t\tconst dummyAns = state.knownWordsList.copy();\r\n\t\t\t\tconst dummyMappingTable = state.mappingTable.copy();\r\n\t\r\n\t\t\t\tdummyUnknownWordsList.setPossibleList(minSizeIndex, chooseWord);\r\n\t\r\n\t\t\t\tif(dummyUnknownWordsList.refreshByMappintTable(dummyAns, dummyMappingTable) === false) {\r\n\t\t\t\t\tcontinue;\r\n\t\t\t\t}\r\n\t\t\t\tstack2.push({unknownWordsList: dummyUnknownWordsList, knownWordsList: dummyAns, mappingTable: dummyMappingTable});\r\n\t\t\t}\r\n\t\t\tstate.unknownWordsList.list[minSizeIndex].possibleList = state.unknownWordsList.list[minSizeIndex].possibleList.slice(loopLen);\r\n\t\t\tstate.unknownWordsList.refreshByMappintTable(state.knownWordsList, state.mappingTable);\r\n\t\t}\r\n\t}\r\n\r\n}\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://Substitution/./substitution.js?");

/***/ }),

/***/ "./token-list.js":
/*!***********************!*\
  !*** ./token-list.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"TokenList\": () => (/* binding */ TokenList)\n/* harmony export */ });\n/* harmony import */ var _Token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Token */ \"./Token.js\");\n/* harmony import */ var _dict_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dict.js */ \"./dict.js\");\n\r\n\r\n\r\nclass TokenList {\r\n    constructor() {\r\n        this._list = [];\r\n    }\r\n\r\n\tpattern(str) {\r\n\t\tvar curLetter = 0;\r\n\t\tvar len = str.length;\r\n\t\tvar ret = \"\";\r\n\t\tvar usedLetter = new Array(26);\r\n\t\tfor(var i = 0; i < len; i++) {\r\n\t\t\tif(usedLetter[str[i]] == undefined) {\r\n\t\t\t\tusedLetter[str[i]] = String.fromCharCode(curLetter + 97);\r\n\t\t\t\tcurLetter++;\r\n\t\t\t}\r\n\t\t\tret += usedLetter[str[i]];\r\n\t\t}\r\n\t\treturn ret;\r\n\t}\r\n\r\n\tgenerateWeight(possibleList, weight) {\r\n\t\tconst possibleListLen = possibleList.length;\r\n\t\tif(possibleListLen > 10) {\r\n\t\t\tfor(let i = 0; i < possibleListLen; i++) {\r\n\t\t\t\tif(possibleListLen > 100 && i <= 10) {\r\n\t\t\t\t\tweight[possibleList[i]] = 17;\r\n\t\t\t\t}\r\n\t\t\t\telse if(i / possibleListLen < 0.4) {\r\n\t\t\t\t\tweight[possibleList[i]] = 15;\r\n\t\t\t\t} else if(i / possibleListLen < 0.6) {\r\n\t\t\t\t\tweight[possibleList[i]] = 8;\r\n\t\t\t\t} else if(i / possibleListLen < 0.9) {\r\n\t\t\t\t\tweight[possibleList[i]] = 1;\r\n\t\t\t\t} else {\r\n\t\t\t\t\tweight[possibleList[i]] = -1;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t} else {\r\n\t\t\tfor(let i = 0; i < possibleListLen; i++) {\r\n\t\t\t\tweight[possibleList[i]] = possibleListLen - i;\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\r\n\r\n    build(rawTokens, knownWordsList, mappingTable, weight) {\r\n\t\tconst countOfTokens = rawTokens.length;\r\n\t\tfor(let i = 0; i < countOfTokens; i++) {\r\n\t\t\tif(rawTokens[i] == \"\") {\r\n\t\t\t\tcontinue;\r\n\t\t\t}\r\n\t\t\tconst possibleList = _dict_js__WEBPACK_IMPORTED_MODULE_1__.words[this.pattern(rawTokens[i])].slice(0);\r\n\r\n\t\t\tthis.generateWeight(possibleList, weight);\r\n\r\n\t\t\tconst curToken = new _Token__WEBPACK_IMPORTED_MODULE_0__.Token(rawTokens[i], possibleList, i);\r\n\t\t\tcurToken.customize(mappingTable);\r\n\t\t\tif(curToken.possibleList.length > 1) {\r\n\t\t\t\tthis._list.push(curToken);\r\n\t\t\t} else {\r\n\t\t\t\tknownWordsList.list[curToken.position] = curToken;\r\n\t\t\t}\r\n\t\t}\r\n    }\r\n\r\n    set list(val) {\r\n        this._list = val;\r\n    }\r\n\r\n    get list() {\r\n        return this._list;\r\n    }\r\n\r\n    push(token) {\r\n        this._list.push(token);\r\n    }\r\n\r\n    copy() {\r\n        const retTokenList = new TokenList();\r\n        for(let i = 0; i < this._list.length; i++) {\r\n\t\t\tconst wordToken = this._list[i];\r\n\t\t\tif(!wordToken)continue;\r\n            retTokenList.list[i] = wordToken.copy();\r\n        }\r\n        return retTokenList;\r\n    }\r\n\r\n    getMinPossibleList() {\r\n\t\tvar minLen = this._list[0].possibleList.length;\r\n\t\tvar minIndex = 0;\r\n\t\tfor(let i = 0; i < this._list.length; i++) {\r\n\t\t\tif(minLen > this._list[i].possibleList.length) {\r\n\t\t\t\tminLen = this._list[i].possibleList.length;\r\n\t\t\t\tminIndex = i;\r\n\t\t\t}\r\n\t\t}\r\n        return minIndex;\r\n    }\r\n\r\n\trefreshByMappintTable(knownWordsList, mappingTable) {\r\n\t\tvar loopTime = 0;\r\n        const list = this._list;\r\n\t\tlet lastChanged = 0;\r\n\t\twhile(list.length > 0) {\r\n\t\t\tvar topToken = list.shift();\r\n\t\t\tconst isChanged = topToken.customize(mappingTable);\r\n\t\t\tif(topToken.possibleList.length > 1) {\r\n\t\t\t\tlist.push(topToken);\r\n\t\t\t} else if (topToken.possibleList.length === 0){\r\n\t\t\t\treturn false;\r\n\t\t\t} else {\r\n\t\t\t\tknownWordsList.list[topToken.position] = topToken;\r\n\t\t\t}\r\n\r\n\t\t\tloopTime++;\r\n\t\t\tif(loopTime - lastChanged > list.length) {\r\n\t\t\t\tbreak;\r\n\t\t\t}\r\n\t\t\tif(isChanged) {\r\n\t\t\t\tlastChanged = loopTime;\r\n\t\t\t}\r\n\t\t\t// if(loopTime > 500)break;\r\n\t\t}\r\n\t\treturn true;\r\n\t}\r\n\r\n\r\n\trefreshByMappintTable2(knownWordsList, mappingTable) {\r\n\t\tlet list = this._list;\r\n\t\twhile(1) {\r\n\t\t\tlet isChangedThisTurn = false;\r\n\t\t\tlet newList = [];\r\n\t\t\tfor(let i = 0; i < list.length; i++) {\r\n\t\t\t\tvar topToken = list[i];\r\n\t\t\t\tconst isChanged = topToken.customize(mappingTable);\r\n\t\t\t\tisChangedThisTurn = isChanged || isChangedThisTurn;\r\n\t\t\t\tif(topToken.possibleList.length > 1) {\r\n\t\t\t\t\tnewList.push(topToken);\r\n\t\t\t\t} else if (topToken.possibleList.length === 0){\r\n\t\t\t\t\tthis._list = list;\r\n\t\t\t\t\treturn false;\r\n\t\t\t\t} else {\r\n\t\t\t\t\tknownWordsList.list[topToken.position] = topToken;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\tlist = newList;\r\n\t\t\tif(isChangedThisTurn === false) {\r\n\t\t\t\tbreak;\r\n\t\t\t}\r\n\t\t}\r\n\t\tthis._list = list;\r\n\t\treturn true;\r\n\t}\r\n\r\n    empty() {\r\n        return this._list.length === 0;\r\n    }\r\n\r\n\tsetPossibleList(index, word) {\r\n\t\tthis._list[index].possibleList = [];\r\n\t\tthis._list[index].possibleList.push(word);\r\n\t}\r\n}\r\n\r\n\n\n//# sourceURL=webpack://Substitution/./token-list.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});