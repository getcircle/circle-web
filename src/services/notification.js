import {services} from 'protobufs';

import client from './client';

export function noSearchResults(query, comment) {
    let request = new services.notification.actions.no_search_results.RequestV1({
        query,
        comment,
        /*eslint-disable camelcase*/
        client_type: services.user.containers.token.ClientTypeV1.WEB,
        /*eslint-enable camelcase*/
    });
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.simple(resolve, reject, 'noSearchResults'))
            .catch(error => reject(error));
    });
}
