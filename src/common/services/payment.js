import {services} from 'protobufs';

import client from './client';

export function storeToken(token) {
    let request = new services.payment.actions.store_token.RequestV1({
        token: token.id,
        email: token.email,
    });

    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.action.result.success) {
                    return resolve();
                } else {
                    return reject(response.reject());
                }
            })
            .catch(error => reject(error));
    });
}
