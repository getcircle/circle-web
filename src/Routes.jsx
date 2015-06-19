'use strict';

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route, DefaultRoute} from 'react-router';

const Routes = (
    <Route name="root" path="/" handler={require('./components/App')}>
        <DefaultRoute handler={require('./pages/Login')} />
        <Route
        	name="login"
        	handler={require('./pages/Login')} />
        <Route
        	name="home"
        	handler={require('./pages/Home')} />
    </Route>
);

export default Routes;
