'use strict';

import connectToStores from 'alt/utils/connectToStores';
import {decorate} from 'react-mixin';
import {Navigation} from 'react-router';
import React from 'react';

import AuthStore from '../stores/AuthStore';
import LoginForm from '../components/forms/auth/LoginForm';
import t from '../utils/gettext';


@decorate(Navigation)
class Login extends React.Component {

    static getStores(props) {
        return [AuthStore];
    }

    static getPropsFromStores(props) {
        return AuthStore.getState();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (AuthStore.isLoggedIn()) {
            this.transitionTo(this.props.query.nextPath || '/');
            return false;
        }
        return true;
    }

    render() {
        let containerStyle = {
            textAlign: 'center',
        };

        return (
            <div style={containerStyle}>
                <h1>{ t('Login') }</h1>
                <LoginForm />
            </div>
        );
    }
}

const Component = connectToStores(Login);
// HoC connectToStores doesn't copy over static methods
Component.willTransitionTo = function (transition, params, query, callback) {
    if (AuthStore.isLoggedIn()) {
        transition.redirect('profile-feed');
    }
    callback();
};

export default Component;
