import _ from 'lodash';
import React from 'react';
import { Route, Router } from 'react-router';
import { reduxRouteComponent } from 'redux-react-router';

import { toggleHeader } from './actions/header';

const applyMiddleware = (...middleWares) => {
    const finish = _.noop;
    const handler = _.compose(...middleWares)(finish);
    return (nextState, transition) => handler(nextState, transition);
}

const getRoutes = (history, store) => {

    const loginOnce = (next) => {
        return (nextState, transition) => {
            if (store.getState().authentication.get('authenticated')) {
                transition.to('/');
                return;
            }
            next(nextState, transition);
        };
    };

    const requireAuth = (next) => {
        return (nextState, transition) => {
            if (!store.getState().authentication.get('authenticated')) {
                transition.to('login', null, {nextPathname: nextState.location.pathname});
                return;
            }

            next(nextState, transition);
        };
    };

    const hideHeader = (next) => {
        return (nextState, transition) => {
            store.dispatch(toggleHeader(false));
            next(nextState, transition);
        }
    }

    const defaultMiddleware = [requireAuth];

    return (
        <Router history={history}>
            <Route component={reduxRouteComponent(store)}>
                <Route component={require('./containers/App')}>
                    <Route
                        component={require('./containers/Search')}
                        onEnter={applyMiddleware(requireAuth, hideHeader)}
                        path="/"
                    />
                    <Route
                        component={require('./containers/Location')}
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        path="/location/:locationId"
                    />
                    <Route
                        component={require('./containers/Login')}
                        onEnter={applyMiddleware(loginOnce)}
                        path="/login"
                    />
                    <Route
                        component={require('./containers/Profile')}
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        path="/profile/:profileId"
                    />
                    <Route
                        component={require('./containers/Team')}
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        path="/team/:teamId"
                    />
                    <Route
                        component={require('./containers/NoMatch')}
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        path="*"
                    />
                </Route>
            </Route>
        </Router>
    );
};

export default getRoutes;
