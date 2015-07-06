'use strict';

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import { Route } from 'react-router';

const getRoutes = (flux) => {

    const loginOnce = (nextState, transition) => {
        if (flux.getStore('AuthStore').isLoggedIn()) {
            transition.to('people');
        }
    };

    const requireAuth = (nextState, transition) => {
        if (!flux.getStore('AuthStore').isLoggedIn()) {
            transition.to('login', null, {nextPathname: nextState.location.pathname});
        }
    };

    return (
        <Route path="/" component={require('./components/App')}>
            <Route
                path="login"
                onEnter={loginOnce}
                component={require('./pages/Login')} />
            <Route
                path="people"
                onEnter={requireAuth}
                component={require('./pages/Profiles')} />
            <Route
                path="search"
                onEnter={requireAuth}
                component={require('./pages/Search')} />
            <Route
                path="profile/:profileId"
                onEnter={requireAuth}
                component={require('./pages/Profile')} />
        </Route>
    );
};

export default getRoutes;
