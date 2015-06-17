import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import AuthStore from '../stores/AuthStore';


export default (ComposedComponent) => {
    class AuthenticatedComponent extends React.Component {

        static getStores(props) {
            return [AuthStore];
        }

        static getPropsFromStores(props) {
            return AuthStore.getState();
        }

        render() {
            return (
                <ComposedComponent {...this.props} />
            );
        }

    }

    let Component = connectToStores(AuthenticatedComponent);
    // HoC connectToStores doesn't copy over static methods
    Component.willTransitionTo = function(transition, params, query, callback) {
        if (!AuthStore.isAuthenticated()) {
            transition.redirect('/login', {}, {nextPath: transition.path});
        }
        callback();
    };
    return Component;
};
