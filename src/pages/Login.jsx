'use strict';

import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react';

import LoginForm from '../components/forms/auth/LoginForm';
import t from '../utils/gettext';

@decorate(Navigation)
class Login extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.props.flux
            .getStore('AuthStore')
            .listen(this._handleStoreChange);
    }

    componentWillUnmount() {
        this.props.flux
            .getStore('AuthStore')
            .unlisten(this._handleStoreChange);
    }

    _handleStoreChange = this._handleStoreChange.bind(this)
    _handleStoreChange() {
        const loggedIn = this.props.flux
            .getStore('AuthStore')
            .isLoggedIn();

        if (loggedIn) {
            this.replaceWith(this.props.location.nextPathname || '/');
        }
    }

    render() {
        let containerStyle = {
            textAlign: 'center',
        };

        return (
            <div style={containerStyle}>
                <h1>{ t('Login') }</h1>
                <LoginForm actions={this.props.flux.getActions('AuthActions')} />
            </div>
        );
    }
}

export default Login;
