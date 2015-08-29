import {services} from 'protobufs';

import client from './client';

export function search(query, category) {
    let request = new services.search.actions.search.RequestV1({query, category});
    return new Promise((resolve, reject) => {
        if (query === null || query.trim() === '') {
            resolve({results: []});
        } else {
            client.sendRequest(request)
                .then((response) => {
                    if (response.action.result.success) {
                        let results = response.result ? response.result.results : [];
                        return resolve({results});
                    } else {
                        return reject(response.reject());
                    }
                })
                .catch(error => reject(error));
        }
    });
}
