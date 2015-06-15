require("babel/register");

import fastclick from 'fastclick';
import React from 'react';
import Router from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import * as renderUtils from './utils/render';
import Routes from './routes';

// export for http://fb.me/react-devtools
window.React = React

// Touch related
injectTapEventPlugin();
React.initializeTouchEvents(true)
fastclick(document.body)

Router
    .create({
        routes: Routes,
        scrollBehavior: Router.ScrollToTopBehavior,
        location: Router.HistoryLocation
    })
    .run(function(Handler) {
        React.render(<Handler />, renderUtils.getBody());
    });
