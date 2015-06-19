'use strict';

require('babel/register');

import fastclick from 'fastclick';
import React from 'react';
import { Router } from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { services } from 'protobufs';

import { getBody } from './utils/render';
import getRoutes from './getRoutes';
import Flux from './utils/Flux';

const ProfileV1 = services.profile.containers.ProfileV1;
const UserV1 = services.user.containers.UserV1;

(async () => {

    const flux = new Flux();

    // export for http://fb.me/react-devtools
    window.React = React;

    // Touch related
    injectTapEventPlugin();
    React.initializeTouchEvents(true);
    fastclick(document.body);

    let user = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    let profile = localStorage.getItem('profile');
    if (user && token && profile) {
        flux.getActions('AuthActions').completeAuthentication(UserV1.decode64(user), token);
        flux.getActions('AuthActions').login(ProfileV1.decode64(profile));
    }

    const createElement = (Component, props) => {
        return <Component flux={flux} {...props} />;
    };

    const routes = getRoutes(flux);
    React.render((
        <Router history={BrowserHistory} routes={routes} createElement={createElement} />
    ), getBody());

})();
