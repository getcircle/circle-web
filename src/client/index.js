import 'babel/polyfill';

import FastClick from 'fastclick';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import { Router, match, browserHistory } from 'react-router';
import transit from 'transit-immutable-protobuf-js';
import { trigger } from 'redial';
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
let initialState;
if (window.__INITIAL_STATE) {
    initialState = nameSpaces.fromJSON(window.__INITIAL_STATE);
}
const store = createStore(client, initialState);

const url = {
    host: window.location.host,
    protocol: window.location.protocol,
    raw: window.location.href,
    subdomain: getSubdomain(window.location.hostname),
};

const routes = getRoutes(store, url);

browserHistory.listen(location => {
    match({routes, location}, (error, redirectLocation, renderProps) => {
        const locals = {
            dispatch: store.dispatch,
            getState: store.getState,
            location: renderProps.location,
            params: renderProps.params,
            url,
        };

        // Don't fetch data for initial route, server has done the work
        if (window.__INITIAL_STATE) {
            // Delete global data so subsequent data fetches can occur
            delete window.__INITIAL_STATE;
        } else {
            trigger('fetch', renderProps.components, locals);
        }

        trigger('defer', renderProps.components, locals)
            .then(() => trigger('done', renderProps.components, locals));
    });
});

const elements = [
    <Provider key="provider" store={store}>
        <Router history={browserHistory} routes={routes} />
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

render(<Root children={elements} url={url} userAgent={window.navigator.userAgent}/>, dest);
