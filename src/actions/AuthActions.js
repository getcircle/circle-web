'use strict';

import { authenticateUser, getAuthenticationInstructions, logout } from '../services/user';
import {getProfileWithUserId} from '../services/profile';

class AuthActions {

    constructor() {
        this.generateActions(
            'authenticateFailed',
            'completeAuthentication',
            'getAuthenticationInstructionsSuccess',
            'getAuthenticationInstructionsFailed',
            'login',
            'logoutSuccess',
            'logoutFailed',
        );
    }

    authenticate(backend, key, secret) {
        this.dispatch();
        authenticateUser(backend, key, secret)
            .then((response) => {
                let user = response.user;
                let token = response.token;
                this.actions.completeAuthentication({user, token});
                return Promise.resolve(user);
            })
            .then((user) => getProfileWithUserId(user.id))
            .then((profile) => this.actions.login(profile))
            .catch((error) => this.actions.authenticateFailed(error));
    }

    startGoogleClient() {
        window.gapi.load('auth2', () => {
            const client = window.gapi.auth2.init({
                /*eslint-disable camelcase*/
                // TODO: should be coming from settings
                client_id: '1077014421904-1a697ks3qvtt6975qfqhmed8529en8s2.apps.googleusercontent.com',
                scope: (
                    'https://www.googleapis.com/auth/plus.login ' +
                    'https://www.googleapis.com/auth/plus.profile.emails.read'
                ),
                /*eslint-enable camelcase*/
            });
            this.dispatch({client});
        });
    }

    getAuthenticationInstructions(email) {
        this.dispatch();
        getAuthenticationInstructions(email)
            .then((instructions) => {
                this.actions.getAuthenticationInstructionsSuccess(instructions);
            })
            .catch((error) => {
                this.actions.getAuthenticationInstructionsFailed(error);
            });
    }

    logout() {
        this.dispatch();
        logout()
            .then(() => this.actions.logoutSuccess())
            .catch((error) => this.actions.logoutFailed(error));
    }

}

export default AuthActions;
