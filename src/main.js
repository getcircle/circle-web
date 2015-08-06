'use strict';

require('babel/register');

import FastClick from 'fastclick';
import React from 'react';
import { Router } from 'react-router';
import { history } from 'react-router/lib/BrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { services } from 'protobufs';

import './styles/app.scss';

import { getBody } from './utils/render';
import getRoutes from './getRoutes';
import Flux from './utils/Flux';

const { OrganizationV1 } = services.organization.containers;
const { ProfileV1 } = services.profile.containers;
const { UserV1 } = services.user.containers;

(async () => {

    const flux = new Flux();

    // export for http://fb.me/react-devtools
    window.React = React;

    // Touch related
    injectTapEventPlugin();
    React.initializeTouchEvents(true);
    FastClick.attach(document.body);

    let user = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    let profile = localStorage.getItem('profile');
    let organization = localStorage.getItem('organization');
    if (user && token && profile) {
        flux.getActions('AuthActions').completeAuthentication({token, user: UserV1.decode64(user)});
        flux.getActions('AuthActions').login({
            profile: ProfileV1.decode64(profile),
            organization: OrganizationV1.decode64(organization),
        });
    }

    const createElement = (Component, props) => {
        return <Component flux={flux} {...props} />;
    };

    const routes = getRoutes(flux);
    React.render((
        <Router history={history} routes={routes} createElement={createElement} />
    ), getBody());

})();
