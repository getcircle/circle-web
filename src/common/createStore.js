import { applyMiddleware, createStore, compose } from 'redux';
import { combineReducers } from 'redux-immutablejs';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import createServicesMiddleware from './middleware/services';
import * as reducers from './reducers';

export default function (client, initialState) {

    // NB: "thunk" middleware should be first
    const middleware = [thunk, createServicesMiddleware(client)];
    if (__DEVELOPMENT__ && !__DEVTOOLS__ && __CLIENT__) {
        middleware.push(logger);
    }

    let finalCreateStore;
    if (__DEVELOPMENT__ && __DEVTOOLS__) {
        const { devTools, persistState } = require('redux-devtools');
        finalCreateStore = compose(
            applyMiddleware(...middleware),
            devTools(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
            createStore,
        );
    } else {
        finalCreateStore = applyMiddleware(...middleware)(createStore);
    }
    const reducer = combineReducers(reducers);
    const store = finalCreateStore(reducer, initialState);
    return store;
}

