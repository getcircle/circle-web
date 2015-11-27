var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');

var relativeAssetsPath = '../static/dist';
var assetsPath = path.join(__dirname, relativeAssetsPath);

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {
    devtool: 'source-map',
    context: path.resolve(__dirname, '..'),
    entry: {
        main: ['./src/client']
    },
    output: {
        path: assetsPath,
        filename: '[name]-[chunkhash].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: '/dist/'
    },
    plugins: [
        new CleanPlugin([relativeAssetsPath]),

        new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: false,
            'process.env': {
                API_ENDPOINT: JSON.stringify('https://api.dev.lunohq.com/v1/'),
                GOOGLE_CLIENT_ID: JSON.stringify('1090169577912-57r89ml43udqthb050v57kim3vddlrvu.apps.googleusercontent.com'),
                GOOGLE_MAPS_API_KEY: JSON.stringify('AIzaSyAlKvipmEx76I45QIHP6NAI4pJ0Ybp55u8'),
                MIXPANEL_TOKEN: JSON.stringify('cfe0bd17e174c984714d5996b6a04606'),
            }
        }),

        // ignore dev config
        new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

        // optimiazations
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [
            { test: /\.js$/, loaders: [strip.loader('debug'), 'babel?stage=0&optional=runtime'], exclude: /node_modules/ },
            { test: /\.json$/, loaders: ['json-loader']},
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
            { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
        ]
    },
    node: {
      fs: 'empty',
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
