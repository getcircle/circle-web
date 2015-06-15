require("babel/register");

import fastclick from 'fastclick';
import React from 'react';
import Router from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {services} from 'protobufs';

import * as AuthActions from './actions/auth';
import * as renderUtils from './utils/render';
import Routes from './routes';

const UserV1 = services.user.containers.UserV1;

// export for http://fb.me/react-devtools
window.React = React

// Touch related
injectTapEventPlugin();
React.initializeTouchEvents(true)
fastclick(document.body)

let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
if (user && token) {
    AuthActions.login(UserV1.decode64(user), token);
}

Router
    .create({
        routes: Routes,
        scrollBehavior: Router.ScrollToTopBehavior,
        location: Router.HistoryLocation
    })
    .run(function(Handler) {
        React.render(<Handler />, renderUtils.getBody());
    });
