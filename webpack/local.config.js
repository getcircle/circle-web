var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    devtool: 'cheap-eval-source-map',
    context: path.resolve(__dirname, '..'),
    entry: [
        'webpack-dev-server/client?http://localhost:9110',
        'webpack/hot/only-dev-server',
        './src'
    ],
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new WebpackNotifierPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('app.css', { allChunks: true }),
        new HtmlWebpackPlugin({
            title: 'Luno Local',
            filename: 'index.html',
            template: 'index.template.html',
            favicon: path.join(__dirname, '..', 'static', 'images', 'favicon.ico'),
        }),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: true,
            __DEVTOOLS__: process.env.DEVTOOLS ? true : false,
            'process.env': {
                API_ENDPOINT: JSON.stringify(`http://${process.env.DEVHOST}:8000/v1/`),
                GOOGLE_CLIENT_ID: JSON.stringify('1090169577912-57r89ml43udqthb050v57kim3vddlrvu.apps.googleusercontent.com'),
                GOOGLE_MAPS_API_KEY: JSON.stringify('AIzaSyAlKvipmEx76I45QIHP6NAI4pJ0Ybp55u8'),
                MIXPANEL_TOKEN: JSON.stringify('c9e956923929efeeebcfbce0b9198656'),
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
            { test: /\.js$/, loaders: ['react-hot', 'babel?stage=0&optional=runtime&cacheDirectory'], exclude: /node_modules/ },
            { test: /(components|containers).*\.js$/, loaders: ['react-map-styles'], exclude: /node_modules/ },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
            { test: /\.json$/, loaders: ['json-loader']}
        ]
    },
    node: {
      fs: 'empty'
    },
};
