'use strict';

import client from '../services/client';

class AuthStore {

    constructor() {
        this.bindActions(this.alt.getActions('AuthActions'));

        this.user = null;
        this.token = null;
        this.profile = null;
    }

    onCompleteAuthentication({user, token}) {
        this.user = user;
        this.token = token;
        localStorage.setItem('user', user.toBase64());
        localStorage.setItem('token', token);
        client.authenticate(token);
    }

    onLogin(profile) {
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
