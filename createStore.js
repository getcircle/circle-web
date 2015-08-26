import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import servicesMiddleware from './middleware/services';
import logger from 'redux-logger';

// NB: "thunk" middleware should be first
const middleware = [thunk, servicesMiddleware];
if (__DEVELOPMENT__) {
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

export default finalCreateStore;
