'use strict';

import {services} from 'protobufs';

import client from '../services/client';

class AuthStore {

    static backends = services.user.actions.authenticate_user.RequestV1.AuthBackendV1

    constructor() {
        this.bindActions(this.alt.getActions('AuthActions'));
        this._setInitialState();
    }

    _setInitialState() {
        this.user = null;
        this.token = null;
        this.profile = null;
        this.googleClient = null;
        this.authenticationInstructions = null;
        this.shouldUseGoogleLogin = false;
        this.shouldUseInternalLogin = false;
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

    onLogoutSuccess() {
        localStorage.clear();
        this._setInitialState();
    }

    onStartGoogleClient(details) {
        this.googleClient = details.client;
    }

    onGetAuthenticationInstructionsSuccess(instructions) {
        this.authenticationInstructions = instructions;
        switch (instructions.backend) {
            case AuthStore.backends.GOOGLE:
                this.shouldUseGoogleLogin = true;
                break;
            case AuthStore.backends.INTERNAL:
                this.shouldUseInternalLogin = true;
                break;
        }
    }

    static isAuthenticated() {
        return this.getState().token !== null;
    }

    static isLoggedIn() {
        return this.getState().profile !== null;
    }

}

export default AuthStore;
