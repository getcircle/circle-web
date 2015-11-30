import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import servicesMiddleware from './middleware/services';
import * as reducers from './reducers';

export default function () {

    // NB: "thunk" middleware should be first
    const middleware = [thunk, servicesMiddleware];
    if (__DEVELOPMENT__ && !__DEVTOOLS__) {
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
    const store = finalCreateStore(reducer);
    return store;
}

