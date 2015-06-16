import connectToStores from 'alt/utils/connectToStores';
import {decorate} from 'react-mixin';
import {Navigation} from 'react-router';
import React from 'react';

import AuthStore from '../../stores/auth';
import LoginForm from '../forms/auth/login';
import t from '../../utils/gettext';


@decorate(Navigation)
class Login extends React.Component {

    static getStores(props) {
        return [AuthStore];
    }

    static getPropsFromStores(props) {
        return AuthStore.getState();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (AuthStore.isAuthenticated()) {
            this.transitionTo(this.props.query.nextPath || '/');
            return false;
        }
        return true;
    }

    render() {
        return (
            <div>
                <h1>{ t('Login') }</h1>
                <LoginForm />
            </div>
        )
    }
}

const Component = connectToStores(Login);
// HoC connectToStores doesn't copy over static methods
Component.willTransitionTo = function(transition, params, query, callback) {
    if (AuthStore.isAuthenticated()) {
        transition.redirect('/');
    }
    callback();
}

export default Component;
