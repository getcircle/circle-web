'use strict';

import {authenticateUser} from '../services/UserService';
import {getProfileWithUserId} from '../services/ProfileService';

class AuthActions {

    authenticate(email, password) {
        this.dispatch();
        authenticateUser(email, password)
            .then((response) => {
                let user = response.user;
                let token = response.token;
                this.actions.completeAuthentication(user, token);
                return Promise.resolve(user);
            })
            .then((user) => {
                return getProfileWithUserId(user.id);
            })
            .then((profile) => {
                this.actions.login(profile);
            })
            .catch((error) => {
                this.actions.authenticateFailed(error);
            });
    }

    authenticateFailed(error) {
        this.dispatch(error);
    }

    completeAuthentication(user, token) {
        this.dispatch({user, token});
    }

    login(profile) {
        this.dispatch(profile);
    }

}

export default AuthActions;
