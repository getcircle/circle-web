import alt from '../alt';
import {createStore} from 'alt/utils/decorators';


import AuthActions from '../actions/auth';


@createStore(alt, 'AuthStore')
class AuthStore {

    constructor() {
        this.user = null;
        this.token = null;

        this.bindListeners({
            handleLogin: AuthActions.LOGIN
        });
    }

    handleLogin(action) {
        this.user = action.user;
        this.token = action.token;
    }

    static isAuthenticated() {
        let state = this.getState();
        return state.token !== null;
    }

}

export default AuthStore;
