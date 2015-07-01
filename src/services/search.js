'use strict';

import {services} from 'protobufs';

import client from './client';
import logger from '../utils/logger';

export function search(query, category) {
    let request = new services.search.actions.search.RequestV1({query, category});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let {results} = response.result;
                resolve({results});
            })
            .catch((error) => {
                logger.log(`Error fetching search results: ${error}`);
                reject(error);
            });
    });
}
