'use strict';

import {services} from 'protobufs';

import client from './client';
import logger from '../utils/logger';

export function authenticateUser(email, password) {
    /*eslint-disable camelcase*/
    let parameters = {
        backend: services.user.actions.authenticate_user.RequestV1.AuthBackendV1.INTERNAL,
        credentials: {
            key: email,
            secret: password,
       },
        client_type: services.user.containers.token.ClientTypeV1.WEB,
    };
    /*eslint-enable camelcase*/

    let request = new services.user.actions.authenticate_user.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let {user, token} = response.result;
                resolve({user, token});
            })
            .catch((error) => {
                logger.log(`Error logging in: ${error}`);
                reject(error);
            });
    });
}
