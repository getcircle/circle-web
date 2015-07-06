'use strict';

import { authenticateUser, getAuthenticationInstructions, logout } from '../services/user';
import { getOrganization } from '../services/organization';
import { getProfileWithUserId } from '../services/profile';

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
        let loginData = {};
        this.alt.getActions('RequestActions').start();
        authenticateUser(backend, key, secret)
            .then((response) => {
                let user = response.user;
                let token = response.token;
                this.actions.completeAuthentication({user, token});
                return Promise.resolve(user);
            })
            .then((user) => getProfileWithUserId(user.id))
            .then((profile) => {
                loginData.profile = profile;
                return getOrganization(profile.organization_id);
            })
            .then((organization) => {
                loginData.organization = organization;
                this.actions.login(loginData);
                this.alt.getActions('RequestActions').success();
            })
            .catch((error) => {
                this.actions.authenticateFailed(error);
                this.alt.getActions('RequestActions').fail(error);
            });
    }

    getAuthenticationInstructions(email) {
        this.alt.getActions('RequestActions').start();
        getAuthenticationInstructions(email)
            .then((instructions) => {
                this.actions.getAuthenticationInstructionsSuccess(instructions);
                this.alt.getActions('RequestActions').success();
                // XXX not sure if this is the best place for this logic.
                if (instructions.backend === this.alt.getStore('AuthStore').backends.GOOGLE) {
                    this.alt.getActions('GoogleAuthActions').startClient();
                }
            })
            .catch((error) => {
                this.actions.getAuthenticationInstructionsFailed(error);
                this.alt.getActions('RequestActions').fail(error);
            });
    }

    logout() {
        this.alt.getActions('RequestActions').start();
        logout()
            .then(() => {
                this.actions.logoutSuccess();
                this.alt.getActions('RequestActions').success();
            })
            .catch((error) => {
                this.actions.logoutFailed(error);
                this.alt.getActions('RequestActions').fail(error);
            });
    }

}

export default AuthActions;
