require('babel/register');

import FastClick from 'fastclick';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';

import './common/styles/app.scss';

import { getBody } from './common/utils/render';
import Root from './common/Root';

(async () => {

    if (__DEVELOPMENT__) {
        // export for http://fb.me/react-devtools
        window.React = React;
    }

    // Touch related
    injectTapEventPlugin();
    FastClick.attach(document.body);

    ReactDOM.render(<Root />, getBody());

})();
