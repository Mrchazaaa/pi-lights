var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: ['./src/index.js'],
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  module: {
      rules: [
      {
        test: /\.js$/, // a regular expression that catches .js files
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      { test: /\.css$/, use: 'css-loader' },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  devServer: {
    port: 3000, // most common port
    contentBase: './build',
    inline: false
  }
}