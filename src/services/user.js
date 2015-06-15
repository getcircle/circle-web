import client from '../services/client';
import {services} from 'protobufs';
import * as AuthActions from '../actions/auth';

export function authenticateUser(email, password) {
    let parameters = {
        backend: services.user.actions.authenticate_user.RequestV1.AuthBackendV1.INTERNAL,
        credentials: {
            key: email,
            secret: password
        },
        client_type: services.user.containers.token.ClientTypeV1.WEB
    };

    let request = new services.user.actions.authenticate_user.RequestV1(parameters);
    client.sendRequest(request)
    .then(function(response) {
        AuthActions.login(response.result.user, response.result.token);
    })
    .catch(function(error) {
        console.log(`Error logging in: ${error}`);
    });
}
