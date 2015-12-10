require('babel-core/polyfill');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');

var assetsPath = path.resolve(__dirname, '../static/dist');
var host = 'localhost';
var port = parseInt(process.env.PORT) + 1 || 3001;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'))
    .development();

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};
var babelLoaderQuery = Object.assign({}, babelrcObject, babelrcObjectDevelopment);
delete babelLoaderQuery.env;

babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
if (babelLoaderQuery.plugins.indexOf('react-transform') < 0) {
  babelLoaderQuery.plugins.push('react-transform');
}

babelLoaderQuery.extra = babelLoaderQuery.extra || {};
if (!babelLoaderQuery.extra['react-transform']) {
  babelLoaderQuery.extra['react-transform'] = {};
}
if (!babelLoaderQuery.extra['react-transform'].transforms) {
  babelLoaderQuery.extra['react-transform'].transforms = [];
}
babelLoaderQuery.extra['react-transform'].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
});

module.exports = {
    devtool: 'cheap-eval-source-map',
    context: path.resolve(__dirname, '..'),
    entry: {
        main: [
            'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
            './src/client'
        ]
    },
    output: {
        chunkFilename: '[name]-[chunkhash].js',
        filename: '[name]-[hash].js',
        path: assetsPath,
        publicPath: 'http://' + host + ':' + port + '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new WebpackNotifierPlugin(),
        new webpack.IgnorePlugin(/webpack-stats\.json$/),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: process.env.DEVTOOLS ? true : false,
            'process.env': {
                GOOGLE_CLIENT_ID: JSON.stringify('1090169577912-57r89ml43udqthb050v57kim3vddlrvu.apps.googleusercontent.com'),
                GOOGLE_MAPS_API_KEY: JSON.stringify('AIzaSyAlKvipmEx76I45QIHP6NAI4pJ0Ybp55u8'),
                MIXPANEL_TOKEN: JSON.stringify('c9e956923929efeeebcfbce0b9198656'),
            }
        }),
        webpackIsomorphicToolsPlugin
    ],
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel?' + JSON.stringify(babelLoaderQuery)], exclude: /node_modules/ },
            { test: /\.json$/, loaders: ['json-loader']},
            { test: /\.scss$/, loader: 'style!css!sass' },
            { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
        ]
    },
    node: {
      fs: 'empty'
    },
    resolve: {
        alias: {
            'Long': 'long',
            'ByteBuffer': 'bytebuffer'
        },
        modulesDirectories: [
            'src',
            'node_modules',
        ],
        extensions: ['', '.json', '.js']
    },
    progress: true,
};
