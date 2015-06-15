import React from 'react';

import authStore from '../stores/auth';


class AuthenticatedComponent extends React.Component {
    static willTransitionTo(transition, params, query, callback) {
        if (!authStore.isAuthenticated()) {
            transition.redirect('/login', {nextPathName: transition.path});
        }
        callback();
    }
}

export default AuthenticatedComponent;
