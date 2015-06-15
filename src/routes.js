import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import authStore from './stores/auth';
import Home from './components/pages/home';
import Login from './components/pages/login';
import Master from './components/master';

const Routes = (
    <Route name="root" path="/" handler={Master}>
        <Route name="login" handler={Login} />
        <Route name="home" handler={Home} />

        <DefaultRoute handler={Home} />
    </Route>
)

export default Routes;
