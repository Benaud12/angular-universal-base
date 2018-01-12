const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    lambda: './lambda.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'server': path.join(__dirname, 'dist', 'server.js')
    }
  },
  target: 'node',
  externals: [/(node_modules|main\..*\.js)/,],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ]
}
