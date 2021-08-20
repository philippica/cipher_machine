const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'Solver',
    libraryTarget: 'umd',
    globalObject: 'this',
  }
};