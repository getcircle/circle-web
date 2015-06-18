import connectToStores from 'alt/utils/connectToStores';
import React from 'react';
import * as mui from 'material-ui';

import AuthStore from '../stores/AuthStore';

const {AppBar, AppCanvas, ClearFix, Styles} = mui;
const {Spacing} = Styles;


export default (ComposedComponent) => {
    class AuthenticatedComponent extends React.Component {

        static getStores() {
            return [AuthStore];
        }

        static getPropsFromStores() {
            return AuthStore.getState();
        }

        render() {
            return (
                <AppCanvas>
                    <ComposedComponent {...this.props} />
                </AppCanvas>
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
