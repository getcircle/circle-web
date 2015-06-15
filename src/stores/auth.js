import ActionTypes from '../constants/action_types'
import BaseStore from './base';

var _currentUser = null;
var _currentToken = null;


class AuthStore extends BaseStore {

    authenticationCompleted(action) {
        _currentUser = action.result.user;
        _currentToken = action.result.token;
        this.emitChange();
    }

    get currentUser() {
        return _currentUser;
    }

    get currentToken() {
        return _currentToken;
    }

    isAuthenticated() {
        return _currentUser !== null;
    }

}

export default new AuthStore();
