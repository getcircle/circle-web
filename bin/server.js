#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)
var path = require('path');
var rootDir = path.resolve(__dirname, '..');

/**
 * Define universal constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__LOCAL__ = process.env.NODE_ENV === 'local';
global.__DEVTOOLS__ = false;
global.localStorage = null;
process.env.GOOGLE_MAPS_API_KEY = 'AIzaSyAlKvipmEx76I45QIHP6NAI4pJ0Ybp55u8';

if (__LOCAL__) {
    if (!require('piping')({
        hook: true,
        ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
        return;
    }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
    .development(__LOCAL__)
    .server(rootDir, function() {
        require('../src/server');
    });
