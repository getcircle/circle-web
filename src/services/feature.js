import { services } from 'protobufs';

import client from './client';

export function getFlags() {
    let request = new services.feature.actions.get_flags.RequestV1();
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.isSuccess()) {
                    // Protobuf.js doesn't support serializing maps to JSON,
                    // so transfer these values to a normal object
                    const flags = {};
                    response.result.flags.forEach((value, key) => {
                        flags[key] = value;
                    });
                    resolve(flags);
                } else {
                    reject(response.reject());
                }
            })
            .catch(error => reject(error));
    });
}
