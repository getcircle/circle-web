var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./dev.config');

new WebpackDevServer(webpack(config), {
  contentBase: path.resolve(__dirname, '..', './dist'),
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true
}).listen(9110, 'localhost', function (err) {
  if (err) console.log(err);
  console.log('Listening at localhost:9110');
});
