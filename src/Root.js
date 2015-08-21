import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import React, { PropTypes } from 'react';
import { routerStateReducer } from 'redux-react-router';
import thunk from 'redux-thunk';

import getRoutes from './getRoutes';
import * as reducers from './reducers';
import ThemeManager from './utils/ThemeManager';
import { serviceRequest} from './middleware';

import PureComponent from './components/PureComponent';

const reducer = combineReducers({
    router: routerStateReducer, 
    ...reducers,
});
// NB: "thunk" middleware should be first
const createStoreWithMiddleware = applyMiddleware(thunk, logger, serviceRequest)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class Root extends PureComponent {

    static propTypes = {
        history: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    render() {
        const { history } = this.props;
        return (
            <Provider store={store}>
                {getRoutes.bind(null, history, store)}
            </Provider>
        );
    }
}
