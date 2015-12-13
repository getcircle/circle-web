import React from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';

export default function (content, store, assets) {
    const styleAssets = Object.keys(assets.styles).map((style, key) =>
        <link
            charSet="UTF-8"
            href={assets.styles[style]}
            key={key}
            media="screen, projection"
            rel="stylesheet"
            type="text/css"
        />
    );
    const styles = styleAssets.length !== 0 ? ReactDOM.renderToString(styleAssets) : '';
    return `
    <!doctype html>
    <html lang="en-us">
        <head>
            <meta charset="utf-8">
            ${styles}
            <!--[if lt IE 9]>
                <script type="text/javascript">
                    // Console-polyfill. MIT license.
                    // https://github.com/paulmillr/console-polyfill
                    // Make it safe to do console.log() always.
                    (function(global) {
                      'use strict';
                      global.console = global.console || {};
                      var con = global.console;
                      var prop, method;
                      var empty = {};
                      var dummy = function() {};
                      var properties = 'memory'.split(',');
                      var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                         'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
                         'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
                      while (prop = properties.pop()) if (!con[prop]) con[prop] = empty;
                      while (method = methods.pop()) if (typeof con[method] !== 'function') con[method] = dummy;
                    })(typeof window === 'undefined' ? this : window);
                    // Using 'this' for web workers while maintaining compatibility with browser
                    // targeted script loaders such as Browserify or Webpack where the only way to
                    // get to the global object is via 'window'
                </script>

                <script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.1.14/es5-shim.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.1.14/es5-sham.min.js"></script>

                <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
            <![endif]-->

            <!-- Begin Google Log In -->
            <script type="text/javascript" src="https://apis.google.com/js/client.js" async defer></script>
            <!-- End Google Log In -->
            <!-- Begin Google Maps -->
            <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp" async></script>
            <!-- End Google Maps -->
        </head>
        <body class="layout">
            <div class="js-content">${content}</div>
            <script>
                window.__INITIAL_STATE=${serialize(store.getState())};
            </script>
            <script src="${assets.javascript.main}"></script>
        </body>
    </html>
    `;
};
