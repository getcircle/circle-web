require('babel/register');

import fastclick from 'fastclick';
import React from 'react';
import Router from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {services} from 'protobufs';

import AuthActions from './actions/AuthActions';
import {getBody} from './utils/render';
import Routes from './routes';

const ProfileV1 = services.profile.containers.ProfileV1;
const UserV1 = services.user.containers.UserV1;

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
	AuthActions.completeAuthentication(UserV1.decode64(user), token);
    AuthActions.login(ProfileV1.decode64(profile));
}

Router
    .create({
        routes: Routes,
        scrollBehavior: Router.ScrollToTopBehavior,
        location: Router.HistoryLocation,
    })
    .run(function(Handler) {
        React.render(<Handler />, getBody());
    });
