'use strict';

import { services } from 'protobufs';

import client from './client';
import logger from '../utils/logger';

export function getOrganization(organizationId) {
    /*eslint-disable camelcase*/
    let parameters = {
        organization_id: organizationId,
    };
    /*eslint-enable camelcase*/

    let request = new services.organization.actions.get_organization.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { organization } = response.result;
                resolve(organization);
            })
            .catch((error) => {
                logger.log(`Error fetching organization: ${error}`);
                reject(error);
            });
    });
}
