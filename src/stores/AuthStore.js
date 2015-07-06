'use strict';

import _ from 'lodash';
import { services } from 'protobufs';

import client from '../services/client';
import logger from '../utils/logger';
import { logout } from '../utils/google';

class AuthStore {

    static backends = services.user.actions.authenticate_user.RequestV1.AuthBackendV1

    constructor() {
        this.bindActions(this.alt.getActions('AuthActions'));
        _.forEach(this._getInitialState(), (value, key) => {
            this[key] = value;
        });
    }

    _getInitialState() {
        return {
            user: null,
            token: null,
            profile: null,
            googleClient: null,
            authenticationInstructions: null,
            authBackend: null,
            organization: null,
        };
    }

    onCompleteAuthentication({user, token}) {
        this.setState({user, token});
        localStorage.setItem('user', user.toBase64());
        localStorage.setItem('token', token);
        client.authenticate(token);
    }

    onLogin({profile, organization}) {
        this.setState({profile, organization});
        localStorage.setItem('profile', profile.toBase64());
        localStorage.setItem('organization', organization.toBase64());
    }

    onLogoutSuccess() {
        localStorage.clear();
        client.logout();
        logout()
            .catch((error) => {
                logger.log(`Error logging out of google: ${error}`);
                // XXX .finally doesn't seem to work
                this.alt.flush();
            })
            .then(() => {
                this.alt.flush();
            });
    }

    onGetAuthenticationInstructionsSuccess(instructions) {
        this.setState({
            authenticationInstructions: instructions,
            authBackend: instructions.backend,
        });
    }

    static isAuthenticated() {
        return this.getState().token !== null;
    }

    static isLoggedIn() {
        return this.getState().profile !== null;
    }

}

export default AuthStore;
