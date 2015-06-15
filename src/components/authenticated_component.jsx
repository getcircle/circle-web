import React from 'react';

import AuthStore from '../stores/auth';


export default (ComposedComponent) => {
    return class AuthenticatedComponent extends React.Component {
        static willTransitionTo(transition, params, query, callback) {
            if (!AuthStore.isAuthenticated()) {
                transition.redirect('/login', {}, {nextPath: transition.path});
            }
            callback();
        }

        constructor() {
            super();
            this.state = this._getState();
        }

        componentDidMount() {
            this.changeListener = this._onChange.bind(this);
            AuthStore.addChangeListener(this.changeListener);
        }

        componentWillUnmount() {
            AuthStore.removeChangeListener(this.changeListener);
        }

        _getState() {
            return {
                authenticated: AuthStore.isAuthenticated(),
                user: AuthStore.currentUser,
                token: AuthStore.currentToken
            }
        }

        _onChange() {
            this.setState(self._getState());
        }

        render() {
            return (
                <ComposedComponent
                    {...this.props}
                    user={this.state.user}
                    token={this.state.token}
                    authenticated={this.state.authenticated} />
            );
        }

    };
}
