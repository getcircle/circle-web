var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var strip = require('strip-loader');

module.exports = {
    devtool: 'source-map',
    context: path.resolve(__dirname, '..'),
    entry: ['./src'],
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/'
    },
    plugins: [
        new ExtractTextPlugin('app.css', { allChunks: true }),
        new HtmlWebpackPlugin({
            title: 'Luno Dev',
            filename: 'index.html',
            template: 'index.template.html',
            favicon: path.join(__dirname, '..', 'static', 'images', 'favicon.ico'),
        }),
        new webpack.DefinePlugin({
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
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            { test: /\.js$/, loaders: [strip.loader('debug'), 'babel?stage=0&optional=runtime'], exclude: /node_modules/ },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
            { test: /\.json$/, loaders: ['json-loader']}
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
    },
};
