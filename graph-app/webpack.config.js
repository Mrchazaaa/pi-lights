
module.exports = {
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
        }
      ]
    },
    devServer: {
      port: 3000, // most common port
      contentBase: './build',
      inline: false
    }
  }