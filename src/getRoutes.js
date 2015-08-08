import _ from 'lodash';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
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

    const displayHeader = (next) => {
        return (nextState, transition) => {
            store.dispatch(toggleHeader(true));
            next(nextState, transition);
        }
    }

    const defaultMiddleware = [requireAuth, displayHeader];

    return (
        <Router history={history}>
            <Route component={reduxRouteComponent(store)}>
                <Route component={require('./components/App')}>
                    <Route
                        path="/"
                        onEnter={applyMiddleware(requireAuth, hideHeader)}
                        component={require('./pages/Search')} />
                    <Route
                        path="/departments"
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        component={require('./pages/Departments')} />
                    <Route
                        path="/location/:locationId"
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        component={require('./pages/Location')} />
                    <Route
                        path="/locations"
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        component={require('./pages/Locations')} />
                    <Route
                        path="/login"
                        onEnter={applyMiddleware(loginOnce)}
                        component={require('./pages/Login')} />
                    <Route
                        path="/people"
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        component={require('./pages/Profiles')} />
                    <Route
                        path="/profile/:profileId"
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        component={require('./pages/Profile')} />
                    <Route
                        path="/team/:teamId"
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        component={require('./pages/Team')} />
                    <Route
                        path="*"
                        onEnter={applyMiddleware(...defaultMiddleware)}
                        component={require('./pages/NoMatch')} />
                </Route>
            </Route>
        </Router>
    );
};

export default getRoutes;
