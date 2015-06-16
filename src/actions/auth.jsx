import alt from '../alt';
import {createActions} from 'alt/utils/decorators';
import {authenticateUser} from '../services/user';


@createActions(alt)
class AuthActions {

    authenticate(email, password) {
        this.dispatch();

        authenticateUser(email, password)
            .then((response) => {
                this.actions.login(response.user, response.token);
            })
            .catch((error) => {
                this.actions.authenticateFailed(error);
            });
    }

    authenticateFailed(error) {
        this.dispatch(error);
    }

    login(user, token) {
        localStorage.setItem('user', user.toBase64());
        localStorage.setItem('token', token);
        this.dispatch({user, token});
    }

}

export default AuthActions;
