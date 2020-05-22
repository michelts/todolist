const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const inProduction = 'production' === process.env.NODE_ENV;
const buildPath = path.resolve(__dirname, './bundles/');

module.exports = {
  entry: {
    app: './app/index',
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: buildPath,
    publicPath: '',
  },

  devtool: inProduction ? 'source-map' : 'eval-source-map',

  plugins: [
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname),
      'node_modules',
    ],
  },
}
