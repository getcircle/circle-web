import alt from '../alt';
import {createStore} from 'alt/utils/decorators';


import AuthActions from '../actions/AuthActions';


@createStore(alt, 'AuthStore')
class AuthStore {

    constructor() {
        this.user = null;
        this.token = null;

        this.bindListeners({
            handleLogin: AuthActions.LOGIN
        });
    }

    handleLogin({user, token}) {
        this.user = user;
        this.token = token;
    }

    static isAuthenticated() {
        let state = this.getState();
        return state.token !== null;
    }

}

export default AuthStore;
