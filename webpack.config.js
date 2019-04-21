var path = require('path');

module.exports = env => ({
  mode: env.NODE_ENV == 'prod' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: env.NODE_ENV == 'prod' ? 'mustache-wax.min.js' : 'mustache-wax.js',
    library: 'wax',
    libraryTarget: 'umd',
    globalObject: 'this'
  }
});