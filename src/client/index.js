import 'babel/polyfill';

import createHistory from 'history/lib/createBrowserHistory';
import FastClick from 'fastclick';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { syncReduxAndRouter } from 'redux-simple-router';
import transit from 'transit-immutable-protobuf-js';
import protobufs from 'protobufs';

import Client from '../common/services/Client';
import createStore from '../common/createStore';
import getRoutes from '../common/getRoutes';
import Root from '../common/Root';
import { getSubdomain } from '../common/utils/subdomains';

import { getBody } from './utils/render';

const client = new Client();
const dest = getBody();
const nameSpaces = transit.withNameSpaces(
    [protobufs.soa, protobufs.services],
    new protobufs.services.$type.clazz().constructor,
);
const initialState = nameSpaces.fromJSON(window.__INITIAL_STATE);
const store = createStore(client, initialState);
const history = createHistory();

const url = {
    host: window.location.host,
    protocol: window.location.protocol,
    raw: window.location.href,
    subdomain: getSubdomain(window.location.hostname),
};

syncReduxAndRouter(history, store, (state) => state.get('routing'));

function createElement(Component, props) {
    // XXX what about fetchDataDeferred?
    if (Component.fetchData) {
        Component.fetchData(store.getState, store.dispatch, props.location, props.params, url);
    }
    return React.createElement(Component, props);
}

const elements = [
    <Provider key="provider" store={store}>
        <Router
            createElement={createElement}
            history={history}
            routes={getRoutes(store, url)}
        />
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

ReactDOM.render(<Root children={elements} url={url} userAgent={window.navigator.userAgent}/>, dest);
