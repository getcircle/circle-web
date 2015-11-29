import 'babel/polyfill';

import createHistory from 'history/lib/createBrowserHistory';
import FastClick from 'fastclick';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import createStore from '../common/createStore';
import getRoutes from '../common/getRoutes';
import { getBody } from '../common/utils/render';
import Root from '../common/Root';

const dest = getBody();
const initialState = Immutable.fromJS(window.__INITIAL_STATE);
const store = createStore(initialState);

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

ReactDOM.render(<Root children={elements} />, dest);
