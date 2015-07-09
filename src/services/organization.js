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
                logger.error(`Error fetching organization: ${error}`);
                reject(error);
            });
    });
}

export function getTeam(teamId) {
    /*eslint-disable camelcase*/
    let parameters = {
        team_id: teamId,
    };
    /*eslint-enable camelcase*/

    let request = new services.organization.actions.get_team.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { team } = response.result;
                resolve(team);
            })
            .catch((error) => {
                logger.error(`Error fetching team: ${error}`);
            });
    });
}

export function getTeamDescendants(teamId) {
    let parameters = {
        'team_ids': [teamId],
    };

    let request = new services.organization.actions.get_team_descendants.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { descendants } = response.result;
                resolve(descendants);
            })
            .catch((error) => {
                logger.error(`Error fetching team descendants: ${error}`);
            });
    });
}
