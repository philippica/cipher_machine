const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'Substitution',
    libraryTarget: 'umd',
    globalObject: 'this',
  }
};