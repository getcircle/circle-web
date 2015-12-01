import {services} from 'protobufs';

import logger from '../utils/logger';

import client from './client';

function handleSearchResponse(query, request) {
    return new Promise((resolve, reject) => {
        if (query === null || query.trim() === '') {
            resolve({results: []});
        } else {
            client.sendRequest(request)
                .then((response) => {
                    if (response.action.result.success) {
                        logger.timeEnd('search-service-' + query);
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

export function search(query, category, attribute, attributeValue) {
    logger.timeStart('search-service-' + query);
    let request = new services.search.actions.search.RequestV1({
        query,
        category,
        attribute,
        /*eslint-disable camelcase*/
        attribute_value: attributeValue,
        /*eslint-enable camelcase*/
    });
    return handleSearchResponse(query, request);
}

export function searchV2(query, category) {
    logger.timeStart('search-service-' + query);
    let request = new services.search.actions.search_v2.RequestV1({
        query,
        category,
    });
    return handleSearchResponse(query, request);
}