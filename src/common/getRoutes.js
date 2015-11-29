import _ from 'lodash';
import React from 'react';
import { IndexRoute, Route } from 'react-router';

import { PAGE_TYPE } from './constants/trackerProperties';
import { toggleHeader } from './actions/header';
import tracker from './utils/tracker';

function applyMiddleware(...middleWares) {
    const finish = _.noop;
    const handler = _.compose(...middleWares)(finish);
    return (nextState, replaceState) => {
        return handler(nextState, replaceState);
    }
}

export default function (store) {

    function loginOnce(next) {
        return (nextState, replaceState) => {
            if (store.getState().get('authentication').get('authenticated')) {
                return replaceState(null, '/');
            }
            next(nextState, replaceState);
        };
    }

    function requireAuth(next) {
        return (nextState, replaceState) => {
            if (!store.getState().get('authentication').get('authenticated')) {
                return replaceState(null, '/login', {next: nextState.location.pathname});
            }
            next(nextState, replaceState);
        }
    }

    function displayHeader(next) {
        return (nextState, replaceState) => {
            store.dispatch(toggleHeader(true));
            next(nextState, replaceState);
        }
    }

    function hideHeader(next) {
        return (nextState, replaceState) => {
            store.dispatch(toggleHeader(false));
            next(nextState, replaceState);
        }
    }

    const trackPageView = (pageType, paramKey) => {
        return (next) => {
            return (nextState, replaceState) => {
                let storeState = store.getState();
                if (storeState.get('authentication') && storeState.get('authentication').get('authenticated')) {
                    let pageId = paramKey !== '' ? nextState.params[paramKey] : '';
                    // Init session is idempotent
                    let authenticationState = store.getState().get('authentication');
                    tracker.initSession(
                        authenticationState.get('profile'),
                        authenticationState.get('organization'),
                        authenticationState.get('team'),
                        authenticationState.get('profileLocation')
                    );
                    tracker.trackPageView(pageType, pageId);
                }
                next(nextState, replaceState);
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

