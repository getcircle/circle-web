'use strict';

import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import AuthStore from '../stores/AuthStore';


const requireAuth = (ComposedComponent) => {
    class AuthenticatedComponent extends React.Component {

        static getStores() {
            return [AuthStore];
        }

        static getPropsFromStores() {
            return AuthStore.getState();
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }

    }

    let Component = connectToStores(AuthenticatedComponent);
    // HoC connectToStores doesn't copy over static methods
    Component.willTransitionTo = function (transition, params, query, callback) {
        if (!AuthStore.isLoggedIn()) {
            transition.redirect('login', {}, {nextPath: transition.path});
        }
        callback();
    };
    return Component;
};

export default requireAuth;
