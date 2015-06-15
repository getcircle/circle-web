import ActionTypes from '../constants/action_types';
import client from '../services/client';
import dispatcher from '../dispatcher/dispatcher';
import {services} from 'protobufs';

export function authenticate(email, password) {
    dispatcher.dispatch({
        type: ActionTypes.AuthStore.AUTHENTICATION_STARTED
    });

    parameters = {
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
            dispatcher.dispatch({
                type: ActionTypes.AuthStore.AUTHENTICATION_COMPLETED,
                result: response.result
            });
        })
        .catch(function(error) {
            dispatcher.dispatch({
                type: ActionTypes.AuthStore.AUTHENTICATION_FAILED,
                error: error
            })
        });
}
