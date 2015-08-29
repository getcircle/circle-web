import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import React, { PropTypes } from 'react';
import { routerStateReducer } from 'redux-react-router';

import createStore from './createStore';
import CSSMixins from './CSSMixins';
import getRoutes from './getRoutes';
import * as reducers from './reducers';
import ThemeManager from './utils/ThemeManager';

import PureComponent from './components/PureComponent';

const reducer = combineReducers({
    router: routerStateReducer,
    ...reducers,
});
const store = createStore(reducer);

export default class Root extends PureComponent {

    static propTypes = {
        history: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object,
    }

    getChildContext() {
        return {
            mixins: CSSMixins,
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    render() {
        const { history } = this.props;
        const elements = [
            <Provider key="provider" store={store}>
                {getRoutes.bind(null, history, store)}
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
