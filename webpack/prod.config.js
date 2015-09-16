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
            title: 'Luno',
            filename: 'index.html',
            template: 'index.template.html',
            favicon: path.join(__dirname, '..', 'static', 'images', 'favicon.ico')
        }),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: false,
            __DEVTOOLS__: false,
            'process.env': {
                // Useful to reduce the size of client-side libraries, eg. react
                NODE_ENV: JSON.stringify('production'),
                API_ENDPOINT: JSON.stringify('https://api.lunohq.com'),
                GOOGLE_CLIENT_ID: JSON.stringify('1057892432577-im3kndbpr8k14dkefm91hb5qth134nb0.apps.googleusercontent.com'),
                GOOGLE_MAPS_API_KEY: JSON.stringify('AIzaSyA_ooSzt99omg9hWAugqIZnAyX8axkjrlk'),
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
            { test: /\.js$/, loaders: [strip.loader('debug'), 'babel?stage=0&optional=runtime', 'react-map-styles'], exclude: /node_modules/ },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
            { test: /\.json$/, loaders: ['json-loader']}
        ]
    },
    node: {
      fs: "empty"
    }
};
