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

export default function (store, url) {

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
                    let state;
                    if (nextState.location.pathname !== '/') {
                        state = {next: nextState.location.pathname};
                    }
                    replaceState(null, '/login', state);
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
     * Redirect to "/" and exit.
     *
     * Unlike "bail", this is used when we want to intentially route to '/'
     * (ie. empty search query)
     */
    function redirectHome(next) {
        return (nextState, replaceState, exit) => {
            replaceState(null, '/');
            exit();
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

    const handleAuthorization = createHandleAuthorizationMiddleware(store, url);

    const trackPageView = (pageType, paramKey) => {
        return (next) => {
            return (nextState, replaceState, exit) => {
                const state = store.getState();
                if (isAuthenticated(state)) {
                    const pageId = paramKey !== undefined ? nextState.params[paramKey] : '';
                    const pageSlug = nextState.params && nextState.params.slug ? nextState.params.slug : '';
                    // Init session is idempotent
                    const authenticationState = state.get('authentication');
                    tracker.initSession(
                        authenticationState.get('profile'),
                        authenticationState.get('organization'),
                    );
                    tracker.trackPageView(pageType, pageId, pageSlug);
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
                    trackPageView(PAGE_TYPE.HOME)
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
                    trackPageView(PAGE_TYPE.BILLING)
                )}
                path="/billing"
            />
            <Route
                component={require('./containers/PostEditorV2').default}
                onEnter={applyMiddleware(
                    requireAuth,
                    hideHeader,
                    trackPageView(PAGE_TYPE.NEW_POST)
                )}
                path="/new-post"
            />
            <Route
                component={require('./containers/PostEditorV2').default}
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
                component={require('./containers/DraftPosts')}
                onEnter={applyMiddleware(
                    requireAuth,
                    hideHeader,
                    trackPageView(PAGE_TYPE.MY_DRAFTS),
                )}
                path="/posts/drafts"
            />
            <Route
                component={require('./containers/Login')}
                onEnter={applyMiddleware(loginOnce)}
                path="/login"
            />
            <Route
                component={require('./containers/ProfileV2').default}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.PROFILE_DETAIL, 'profileId')
                )}
                path="/profile/:profileId/:slug"
            />
            <Route
                component={require('./containers/ProfileV2').default}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.PROFILE_DETAIL, 'profileId')
                )}
                path="/profile/:profileId"
            />
            <Route
                component={require('./containers/SearchV2').default}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.SEARCH, 'query')
                )}
                path="/search/:query"
            />
            <Route
                component={require('./containers/ExplorePeople')}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.EXPLORE_PEOPLE),
                )}
                path="/explore/people"
            />
            <Route
                component={require('./containers/ExploreKnowledge')}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.EXPLORE_KNOWLEDGE),
                )}
                path="/explore/knowledge"
            />
            <Route
                component={require('./containers/ExploreTeams')}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.EXPLORE_TEAMS),
                )}
                path="/explore/teams"
            />
            <Route
                component={require('./containers/NoMatch')}
                onEnter={applyMiddleware(redirectHome)}
                path="/search"
            />
            <Route
                component={require('./containers/Team').default}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.TEAM_DETAIL, 'teamId')
                )}
                path="/team/:teamId"
            />
            <Route
                component={require('./containers/Team').default}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.TEAM_DETAIL, 'teamId')
                )}
                path="/team/:teamId/:slug"
            />
            <Route
                component={require('./containers/Collection')}
                onEnter={applyMiddleware(
                    ...defaultMiddleware,
                    trackPageView(PAGE_TYPE.COLLECTION_DETAIL, 'collectionId')
                )}
                path="/collection/:collectionId"
            />
            <Route
                component={require('./containers/AddIntegration')}
                onEnter={applyMiddleware(...defaultMiddleware)}
                path="/add-integration/:integration"
            />
            <Route
                component={require('./containers/NoMatch')}
                onEnter={applyMiddleware(...defaultMiddleware)}
                path="*"
            />
        </Route>
    );
}
