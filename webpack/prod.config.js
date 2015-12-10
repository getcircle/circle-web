require('babel-core/polyfill');
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
            __DEVELOPMENT__: false,
            __DEVTOOLS__: false,
            'process.env': {
                // Useful to reduce the size of client-side libraries, eg. react
                NODE_ENV: JSON.stringify('production'),
                GOOGLE_CLIENT_ID: JSON.stringify('1057892432577-im3kndbpr8k14dkefm91hb5qth134nb0.apps.googleusercontent.com'),
                GOOGLE_MAPS_API_KEY: JSON.stringify('AIzaSyA_ooSzt99omg9hWAugqIZnAyX8axkjrlk'),
                MIXPANEL_TOKEN: JSON.stringify('62bae2b7a51edf77b99f470ec114324a'),
            }
        }),
        webpackIsomorphicToolsPlugin,

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
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
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
