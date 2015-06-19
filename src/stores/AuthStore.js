'use strict';

import {createStore} from 'alt/utils/decorators';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';
import client from '../services/client';


@createStore(alt, 'AuthStore')
class AuthStore {

    constructor() {
        this.user = null;
        this.token = null;
        this.profile = null;

        this.bindListeners({
            handleLogin: AuthActions.LOGIN,
            handleCompleteAuthentication: AuthActions.COMPLETE_AUTHENTICATION,
        });
    }

    handleCompleteAuthentication({user, token}) {
        this.user = user;
        this.token = token;
        localStorage.setItem('user', user.toBase64());
        localStorage.setItem('token', token);
        client.authenticate(token);
    }

    handleLogin(profile) {
        this.profile = profile;
        localStorage.setItem('profile', profile.toBase64());
    }

    static isAuthenticated() {
        return this.getState().token !== null;
    }

    static isLoggedIn() {
        return this.getState().profile !== null;
    }

}

export default AuthStore;
