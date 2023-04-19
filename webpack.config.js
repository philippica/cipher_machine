const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  //mode: 'development',
  entry: path.resolve(__dirname, './src/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index-[chunkhash:8].js',
    library: 'Solver',
    libraryTarget: 'umd',
    globalObject: 'this',
    hashFunction: "sha256"
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      scriptLoading: 'blocking',
      minify: {
        minifyCSS: true,
        minifyJS: true,
        minify: true
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/static", to: "static" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ],
  },
};