import ActionTypes from '../constants/action_types';
import dispatcher from '../dispatcher/dispatcher';

export function login(user, token) {
    localStorage.setItem('user', user.toBase64());
    localStorage.setItem('token', token);
    dispatcher.dispatch({
        type: ActionTypes.AuthStore.LOGIN,
        user: user,
        token: token
    });
}
