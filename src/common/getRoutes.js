import _ from 'lodash';
import React from 'react';
import { IndexRoute, Route } from 'react-router';

import { PAGE_TYPE } from './constants/trackerProperties';
import { loadAuth } from './actions/authentication';
import { toggleHeader } from './actions/header';
import createHandleAuthorizationMiddleware from './middleware/createHandleAuthorizationMiddleware';
import { isAuthenticated, isLoaded as isAuthLoaded } from './reducers/authentication';
import raven from './utils/raven';
import tracker from './utils/tracker';

function applyMiddleware(...middleWares) {
    return (nextState, replaceState, cb) => {
        function last(nextState, replaceState, exit) {
            exit();
        };
        const handler = _.flowRight(...middleWares)(last);
        return handler(nextState, replaceState, cb);
    }
}

export default function (store) {

    function loginOnce(next) {
        return (nextState, replaceState, exit) => {
            function checkAuth() {
                if (isAuthenticated(store.getState())) {
                    replaceState(null, '/');
                    return exit();
                }
                next(nextState, replaceState, exit);
            }

            if (!isAuthLoaded(store.getState())) {
                store.dispatch(loadAuth()).then(checkAuth);
            } else {
                checkAuth();
            }
        };
    }

    function requireAuth(next) {
        return (nextState, replaceState, exit) => {
            function checkAuth() {
                if (!isAuthenticated(store.getState())) {
                    replaceState(null, '/login', {next: nextState.location.pathname});
                    return exit();
                }
                next(nextState, replaceState, exit);
            }

            if (!isAuthLoaded(store.getState())) {
                store.dispatch(loadAuth()).then(checkAuth);
            } else {
                checkAuth();
            }
        }
    }

    function displayHeader(next) {
        return (nextState, replaceState, exit) => {
            store.dispatch(toggleHeader(true));
            next(nextState, replaceState, exit);
        }
    }

    function hideHeader(next) {
        return (nextState, replaceState, exit) => {
            store.dispatch(toggleHeader(false));
            next(nextState, replaceState, exit);
        }
    }

    /**
     * Simply redirect to "/" and exit.
     *
     * This middleware is meant as a catch all for routes such as "/auth" that
     * don't map to a component and should be handled only with middleware.
     */
    function bail(next) {
        return (nextState, replaceState, exit) => {
            raven.captureMessage('Bail middleware reached!');
            replaceState(null, '/');
            exit();
        }
    }

    const handleAuthorization = createHandleAuthorizationMiddleware(store);

    const trackPageView = (pageType, paramKey) => {
        return (next) => {
            return (nextState, replaceState, exit) => {
                let state = store.getState();
                if (isAuthenticated(state)) {
                    let pageId = paramKey !== '' ? nextState.params[paramKey] : '';
                    // Init session is idempotent
                    let authenticationState = state.get('authentication');
                    tracker.initSession(
                        authenticationState.get('profile'),
                        authenticationState.get('organization'),
                        authenticationState.get('team'),
                        authenticationState.get('profileLocation')
                    );
                    tracker.trackPageView(pageType, pageId);
                }
                next(nextState, replaceState, exit);
            }
        }
    }

    const defaultMiddleware = [requireAuth, displayHeader];

    return (
        <Route component={require('./containers/App')} path="/">
            <IndexRoute
                component={require('./containers/Home')}
                onEnter={applyMiddleware(
                    requireAuth,
                    hideHeader,
                    trackPageView(PAGE_TYPE.HOME, '')
                )}
            />
            <Route
                component={require('./containers/NoMatch')}
                onEnter={applyMiddleware(loginOnce, handleAuthorization, bail)}
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
                component={require('./containers/PostEditor').default}
                onEnter={applyMiddleware(
                    requireAuth,
                    hideHeader,
                    trackPageView(PAGE_TYPE.NEW_POST, '')
                )}
                path="/new-post"
            />
            <Route
                component={require('./containers/PostEditor').default}
                onEnter={applyMiddleware(
                    requireAuth,
                    hideHeader,
                    trackPageView(PAGE_TYPE.EDIT_POST, 'postId')
                )}
                path="/post/:postId/edit"
            />
            <Route
                component={require('./containers/Post')}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.POST_DETAIL, 'postId')
                )}
                path="/post/:postId"
            />
            <Route
                component={require('./containers/Posts')}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.MY_KNOWLEDGE, 'postState')
                )}
                path="/posts/:postState"
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
                path="/profile/:profileId/:slug"
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
                component={require('./containers/Search')}
                onEnter={applyMiddleware(
                    requireAuth,
                    hideHeader,
                    trackPageView(PAGE_TYPE.SEARCH, 'query')
                )}
                path="/search/:query"
            />
            <Route
                component={require('./containers/Search')}
                onEnter={applyMiddleware(
                    requireAuth,
                    hideHeader,
                )}
                path="/search"
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
                component={require('./containers/NoMatch')}
                onEnter={applyMiddleware(...defaultMiddleware)}
                path="*"
            />
        </Route>
    );
}

