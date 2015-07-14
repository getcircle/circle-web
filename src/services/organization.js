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
                reject(error);
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
                reject(error);
            });
    });
}

export function getLocation(locationId) {
    let parameters = {
        'location_id': locationId,
    };

    let request = new services.organization.actions.get_location.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { location } = response.result;
                resolve(location);
            })
            .catch((error) => {
                logger.error(`Error fetching location: ${error}`);
                reject(error);
            });
    });
}

export function getTeamsForLocationId(locationId, nextRequest) {
    let parameters = {
        'location_id': locationId,
    };

    // TODO do something with nextRequest

    let request = new services.organization.actions.get_teams.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let { teams } = response.result;
                resolve({
                    locationId,
                    teams,
                    nextRequest: response.getNextRequest(),
                });
            })
            .catch((error) => {
                logger.error(`Error fetching teams for location: ${error}`);
                reject(error);
            });
    });
}

export function getLocations() {
    let request = new services.organization.actions.get_locations.RequestV1();
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.errors.length) {
                    return reject({
                        errors: response.errors,
                        errorDetails: response.errorDetails,
                    });
                }

                let { locations } = response.result;
                resolve(locations);
            })
            .catch((error) => {
                logger.error(`Error fetching organization locations: ${error}`);
                reject(error);
            });
    });
}

export function getTeams(parameters) {
    let request = new services.organization.actions.get_teams.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.errors.length) {
                    return reject({
                        errors: response.errors,
                        errorDetails: response.errorDetails,
                    });
                }

                let { teams } = response.result;
                resolve(teams);
            })
            .catch((error) => {
                logger.error(`Error fetching teams: ${error}`);
                reject(error);
            });
    });
}
