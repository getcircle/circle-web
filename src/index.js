require('babel/register');

import FastClick from 'fastclick';
import history from 'react-router/lib/BrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';

import './styles/app.scss';

import { getBody } from './utils/render';
import Root from './Root';

(async () => {

    if (__DEVELOPMENT__) {
        // export for http://fb.me/react-devtools
        window.React = React;
    }

    // Touch related
    injectTapEventPlugin();
    React.initializeTouchEvents(true);
    FastClick.attach(document.body);

    React.render(<Root history={history} />, getBody());

})();
