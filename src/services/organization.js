import { services } from 'protobufs';

import client from './client';
import logger from '../utils/logger';

export function getOrganization() {
    let request = new services.organization.actions.get_organization.RequestV1();
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

export function getExtendedTeam(teamId) {
    const reportingDetails = getTeamReportingDetails(teamId);
    const team = getTeam(teamId);
    return new Promise((resolve, reject) => {
            Promise.all([reportingDetails, team])
                .then((values) => {
                    let [reportingDetails, team] = values;
                    resolve({reportingDetails, team});
                })
                .catch((error) => {
                    logger.error(`Error fetching extended team: ${error}`);
                    reject(error);
                });
    });
}

export function getTeamReportingDetails(teamId) {
    let parameters = {team_id: teamId};
    let request = new services.organization.actions.get_team_reporting_details.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                let {
                    manager,
                    members,
                    child_teams,
                } = response.result;
                resolve({manager, members, childTeams: child_teams});
            })
            .catch((error) => {
                logger.error(`Error fetching team reporting details: ${error}`);
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
            .then(response => response.finish(resolve, reject, locationId))
            .catch(error => reject(error));
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

export function getLocations(parameters, nextRequest=null) {
    parameters = Object.assign({}, parameters);
    let request;
    if (nextRequest === null) {
        request = new services.organization.actions.get_locations.RequestV1(parameters);
    } else {
        request = nextRequest;
    }
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
                resolve({
                    parameters,
                    locations,
                    nextRequest: response.getNextRequest(),
                });
            })
            .catch((error) => {
                logger.error(`Error fetching organization locations: ${error}`);
                reject(error);
            });
    });
}

export function getTeams(parameters, nextRequest=null) {
    parameters = parameters || {};
    let request;
    if (nextRequest === null) {
        request = new services.organization.actions.get_teams.RequestV1(parameters);
    } else {
        request = nextRequest;
    }
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
                resolve({
                    parameters,
                    teams,
                    nextRequest: response.getNextRequest(),
                });
            })
            .catch((error) => {
                logger.error(`Error fetching teams: ${error}`);
                reject(error);
            });
    });
}

export function getTeamLabel(team) {
    let parts = [];
    if (team.child_team_count > 1) {
        parts.push(`${team.child_team_count} teams`);
    } else if (team.child_team_count === 1) {
        parts.push(`${team.child_team_count} team`);
    }

    if (team.profile_count > 1) {
        parts.push(`${team.profile_count} people`);
    } else if (team.profile_count === 1) {
        parts.push(`${team.profile_count} person`);
    }
    return parts.join(', ');
}
