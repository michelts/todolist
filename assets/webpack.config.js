// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const inProduction = process.env.NODE_ENV === 'production';
const buildPath = path.resolve(__dirname, '../app/static/');

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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname),
      'node_modules',
    ],
  },
};
