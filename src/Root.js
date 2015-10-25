import createHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Router } from 'react-router';

import createStore from './createStore';
import CSSMixins from './CSSMixins';
import getRoutes from './getRoutes';
import CurrentTheme from './utils/ThemeManager';

const store = createStore();

export default class Root extends Component {

    static childContextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object,
    }

    getChildContext() {
        return {
            mixins: CSSMixins,
            muiTheme: CurrentTheme,
        };
    }

    render() {
        const elements = [
            <Provider key="provider" store={store}>
                <Router history={createHistory()} routes={getRoutes(store)} />
            </Provider>
        ];
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
        return <div>{elements}</div>;
    }
}
