import client from '../services/client';
import {services} from 'protobufs';
import AuthActions from '../actions/AuthActions';

export default {

    authenticateUser(email, password) {
        let parameters = {
            backend: services.user.actions.authenticate_user.RequestV1.AuthBackendV1.INTERNAL,
            credentials: {
                key: email,
                secret: password
            },
            client_type: services.user.containers.token.ClientTypeV1.WEB
        };

        let request = new services.user.actions.authenticate_user.RequestV1(parameters);
        return new Promise((resolve, reject) => {
            client.sendRequest(request)
                .then((response) => {
                    let {user, token} = response.result;
                    resolve({user, token});
                })
                .catch((error) => {
                    console.log(`Error logging in: ${error}`);
                    reject(error);
                });
        });
    }


};
