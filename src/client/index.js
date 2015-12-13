import 'babel/polyfill';

import createHistory from 'history/lib/createBrowserHistory';
import FastClick from 'fastclick';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import createStore from '../common/createStore';
import getRoutes from '../common/getRoutes';
import { getBody } from '../common/utils/render';

// import styles so webpack includes them
import '../common/styles/app.scss';

const dest = getBody();
const store = createStore();

debugger;

const elements = [
    <Provider key="provider" store={store}>
        <Router history={createHistory()} routes={getRoutes(store)} />
    </Provider>
];

if (__DEVELOPMENT__) {
    window.React = React; // enable debugger
}

if (__DEVTOOLS__) {
    const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
    elements.push(
        <DebugPanel
            bottom
            key="debugPanel"
            right
            top
        >
            <DevTools monitor={LogMonitor} store={store} />
        </DebugPanel>
    );
}

// Touch related
injectTapEventPlugin();
FastClick.attach(document.body);

ReactDOM.render(<div>{elements}</div>, dest);
