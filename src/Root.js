import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { getBody } from './utils/render';
import getRoutes from './getRoutes';
import { logger, serviceRequest} from './middleware';
import * as reducers from './reducers';

const reducer = combineReducers(reducers);
// NB: "thunk" middleware should be first
const createStoreWithMiddleware = applyMiddleware(thunk, logger, serviceRequest)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class Root extends React.Component {

    static propTypes = {
        history: PropTypes.object.isRequired,
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
