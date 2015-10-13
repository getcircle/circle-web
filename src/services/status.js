import { services } from 'protobufs';

import client from './client';

export function getStatus(statusId) {
    /*eslint-disable camelcase*/
    let request = new services.profile.actions.get_status.RequestV1({status_id: statusId});
    /*eslint-enable camelcase*/
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, statusId))
            .catch(error => reject(error));
    });
}
