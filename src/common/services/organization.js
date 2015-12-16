import merge from 'lodash/object/merge';
import { services } from 'protobufs';

import logger from '../utils/logger';

export function getOrganization(client) {
    let request = new services.organization.actions.get_organization.RequestV1();
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.isSuccess()) {
                    let { organization } = response.result;
                    resolve(organization);
                } else {
                    return reject(response.reject());
                }
            })
            .catch((error) => {
                logger.error(`Error fetching organization: ${error}`);
                reject(error);
            });
    });
}

export function getExtendedTeam(client, teamId) {
    const reportingDetails = getTeamReportingDetails(client, teamId);
    const team = getTeam(client, teamId);
    return new Promise((resolve, reject) => {
        // we merge the two responses, preferring the team objects. merge will do a deep merge on the entities and
        // normalizations
        Promise.all([reportingDetails, team])
            .then(values => resolve(merge(...values)))
            .catch(error => reject(error));
    });
}

export function getTeamReportingDetails(client, teamId) {
    /*eslint-disable camelcase*/
    let request = new services.organization.actions.get_team_reporting_details.RequestV1({team_id: teamId});
    /*eslint-enable camelcase*/
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, teamId))
            .catch(error => reject(error));
    });
}

export function getTeam(client, teamId) {
    /*eslint-disable camelcase*/
    let parameters = {team_id: teamId};
    /*eslint-enable camelcase*/
    let request = new services.organization.actions.get_team.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, teamId))
            .catch(error => reject(error));
    });
}

export function getTeamDescendants(client, teamId) {
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

export function getLocation(client, locationId) {
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

export function getTeamsForLocationId(client, locationId, nextRequest) {
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

export function getLocations(client, parameters, nextRequest=null, key=null) {
    parameters = Object.assign({}, parameters);
    let request = nextRequest ? nextRequest : new services.organization.actions.get_locations.RequestV1(parameters);
    if (key === null) {
        key = Object.values(parameters)[0];
    }
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
    });
}

export function getTeams(client, parameters, nextRequest=null, key=null) {
    parameters = Object.assign({}, parameters);
    const request = nextRequest ? nextRequest : new services.organization.actions.get_teams.RequestV1(parameters);
    if (key === null) {
        key = Object.values(parameters)[0];
    }
    return new Promise((resolve, reject) => {
        client.send(request)
            .then(response => response.finish(resolve, reject, key))
            .catch(error => reject(error));
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

export function updateTeam(client, team) {
    let request = new services.organization.actions.update_team.RequestV1({team: team});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, team))
            .catch(error => reject(error));
    });
}

export function updateLocation(client, location) {
    let request = new services.organization.actions.update_location.RequestV1({location: location});
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, location))
            .catch(error => reject(error));
    });
}

export function setManager(client, profileId, managerProfileId) {
    /*eslint-disable camelcase*/
    let request = new services.organization.actions.set_manager.RequestV1({manager_profile_id: managerProfileId, profile_id: profileId});
    /*eslint-enable camelcase*/
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(response => response.finish(resolve, reject, profileId))
            .catch(error => reject(error));
    });
}
