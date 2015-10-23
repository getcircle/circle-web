import _ from 'lodash';
import React from 'react';
import { Route, Router } from 'react-router';
import { reduxRouteComponent } from 'redux-react-router';

import { PAGE_TYPE } from './constants/trackerProperties';
import { toggleHeader } from './actions/header';
import tracker from './utils/tracker';

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
                transition.to('/login', null, {nextPathname: nextState.location.pathname});
                return;
            }

            next(nextState, transition);
        };
    };

    const displayHeader = (next) => {
        return (nextState, transition) => {
            store.dispatch(toggleHeader(true));
            next(nextState, transition);
        }
    }

    const hideHeader = (next) => {
        return (nextState, transition) => {
            store.dispatch(toggleHeader(false));
            next(nextState, transition);
        }
    }

    const trackPageView = (pageType, paramKey) => {
        return (next) => {
            return (nextState, transition) => {
                let storeState = store.getState();
                if (storeState.authentication && storeState.authentication.get('authenticated')) {
                    let pageId = paramKey !== '' ? nextState.params[paramKey] : '';
                    // Init session is idempotent
                    let authenticationState = store.getState().authentication;
                    tracker.initSession(
                        authenticationState.get('profile'),
                        authenticationState.get('organization'),
                        authenticationState.get('team'),
                        authenticationState.get('profileLocation')
                    );
                    tracker.trackPageView(pageType, pageId);
                }
                next(nextState, transition);
            }
        }
    }

    const defaultMiddleware = [requireAuth, displayHeader];

    return (
        <Router history={history}>
            <Route component={reduxRouteComponent(store)}>
                <Route component={require('./containers/App')}>
                    <Route
                        component={require('./containers/AuthorizationHandler')}
                        onEnter={applyMiddleware(loginOnce)}
                        path="/auth"
                    />
                    <Route
                        component={require('./containers/Billing')}
                        onEnter={applyMiddleware(
                            displayHeader,
                            trackPageView(PAGE_TYPE.BILLING, '')
                        )}
                        path="/billing"
                    />
                    <Route
                        component={require('./containers/Editor')}
                        onEnter={applyMiddleware(
                            requireAuth,
                            hideHeader,
                        )}
                        path="/editor"
                    />
                    <Route
                        component={require('./containers/Search')}
                        onEnter={applyMiddleware(
                            requireAuth,
                            hideHeader,
                            trackPageView(PAGE_TYPE.HOME, '')
                        )}
                        path="/"
                    />
                    <Route
                        component={require('./containers/Location')}
                        onEnter={applyMiddleware(
                            ...defaultMiddleware,
                            trackPageView(PAGE_TYPE.LOCATION_DETAIL, 'locationId')
                        )}
                        path="/location/:locationId"
                    />
                    <Route
                        component={require('./containers/Login')}
                        onEnter={applyMiddleware(loginOnce)}
                        path="/login"
                    />
                    <Route
                        component={require('./containers/Profile')}
                        onEnter={applyMiddleware(
                            ...defaultMiddleware,
                            trackPageView(PAGE_TYPE.PROFILE_DETAIL, 'profileId')
                        )}
                        path="/profile/:profileId"
                    />
                    <Route
                        component={require('./containers/Team')}
                        onEnter={applyMiddleware(
                            ...defaultMiddleware,
                            trackPageView(PAGE_TYPE.TEAM_DETAIL, 'teamId')
                        )}
                        path="/team/:teamId"
                    />
                    <Route
                        component={require('./containers/Status')}
                        onEnter={applyMiddleware(
                            ...defaultMiddleware,
                            trackPageView(PAGE_TYPE.PROFILE_STATUS_DETAIL, 'statusId')
                        )}
                        path="/status/:statusId"
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
