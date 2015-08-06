import {services} from 'protobufs';

import client from './client';
import logger from '../utils/logger';

export function search(query, category) {
    let request = new services.search.actions.search.RequestV1({query, category});
    return new Promise((resolve, reject) => {
        if (query === null || query.trim() === '') {
            resolve({results: []});
        } else {
            client.sendRequest(request)
                .then((response) => {
                    let results = response.result ? response.result.results : [];
                    resolve({results});
                })
                .catch((error) => {
                    logger.log(`Error fetching search results: ${error}`);
                    reject(error);
                });
        }
    });
}
