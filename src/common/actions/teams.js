import { services } from 'protobufs';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/team';

/**
 * Redux action to create a team
 *
 * @param {String} name name of the team
 * @param {String} description description of the team
 * @return {Object} thunk compliant redux action
 */
export function createTeam(name, description = null) {
    const team = new services.team.containers.TeamV1({name, description: {value: description}});
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.CREATE_TEAM,
                types.CREATE_TEAM_SUCCESS,
                types.CREATE_TEAM_FAILURE,
            ],
            remote: (client) => requests.createTeam(client, team),
        },
    };
}

/**
 * Get team
 *
 * @param {String} teamId id of the team
 *
 */
export function getTeam(teamId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_TEAM,
                types.GET_TEAM_SUCCESS,
                types.GET_TEAM_FAILURE,
            ],
            // TODO do we need to add bail here or is this solved with fetching from the cache first?
            remote: (client) => requests.getTeam(client, teamId),
        },
    };
}

/**
 * Get team members
 *
 * @param {String} teamId id of the team
 * @param {services.team.containers.TeamMemberV1.RoleV1} role the member role we want to return
 *
 */
export function getMembers(teamId, nextRequest = null) {
    const role = services.team.containers.TeamMemberV1.RoleV1.MEMBER;
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_TEAM_MEMBERS,
                types.GET_TEAM_MEMBERS_SUCCESS,
                types.GET_TEAM_MEMBERS_FAILURE,
            ],
            remote: (client) => requests.getMembers(client, teamId, role, nextRequest),
        },
        meta: {
            paginateBy: teamId,
        },
    };
}

/**
 * Get team coordinators
 *
 * @param {String} teamId id of the team
 *
 */
export function getCoordinators(teamId, nextRequest = null) {
    const role = services.team.containers.TeamMemberV1.RoleV1.COORDINATOR;
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_TEAM_COORDINATORS,
                types.GET_TEAM_COORDINATORS_SUCCESS,
                types.GET_TEAM_COORDINATORS_FAILURE,
            ],
            remote: (client) => requests.getMembers(client, teamId, role, nextRequest),
        },
        meta: {
            paginateBy: teamId,
        },
    };
}

/**
 * Show the create team modal
 *
 * @return {Object} plain object redux action
 */
export function showModal() {
    return {type: types.MODAL_CREATE_TEAM_SHOW}
}

/**
 * Hide the create team modal
 *
 * @return {Object} plain object redux action
 */
export function hideModal() {
    return {type: types.MODAL_CREATE_TEAM_HIDE}
}

/**
 * Update the team
 *
 * @param {services.team.containers.TeamV1} team team we're updating
 *
 */
export function updateTeam(team) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_TEAM,
                types.UPDATE_TEAM_SUCCESS,
                types.UPDATE_TEAM_FAILURE,
            ],
            remote: (client) => requests.updateTeam(client, team),
        },
    };
}
