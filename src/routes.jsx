import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Master from './components/Master';

const Routes = (
    <Route name="root" path="/" handler={Master}>
        <Route name="login" handler={Login} />
        <Route name="home" handler={Home} />

        <DefaultRoute handler={Home} />
    </Route>
);

export default Routes;
