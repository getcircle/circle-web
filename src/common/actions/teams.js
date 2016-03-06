import { services } from 'protobufs';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/team';
import { retrieveTeam } from '../reducers/denormalizations';
import { paginatedShouldBail } from '../reducers/paginate';
import * as selectors from '../selectors';

/**
 * Redux action to create a team
 *
 * @param {String} name name of the team
 * @param {String} description description of the team
 * @param {Array[services.team.containers.TeamMemberV1]} members an array of members to add to the team
 * @return {Object} thunk compliant redux action
 */
export function createTeam(name, description = null, members = []) {
    const team = new services.team.containers.TeamV1({name, description: {value: description}});
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.CREATE_TEAM,
                types.CREATE_TEAM_SUCCESS,
                types.CREATE_TEAM_FAILURE,
            ],
            remote: client => requests.createTeam(client, team, members),
        },
    };
}

/**
 * Action to add members to a team
 *
 * @param {String} teamId id of the team
 * @param {Array} members members to add to the team
 * @return {Object} thunk compliant redux action
 */
export function addMembers(teamId, members) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.ADD_MEMBERS,
                types.ADD_MEMBERS_SUCCESS,
                types.ADD_MEMBERS_FAILURE,
            ],
            remote: client => requests.addMembers(client, teamId, members),
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
            remote: client => requests.getTeam(client, teamId),
            bailout: (state) => {
                // The get team request provides both the team with permissions
                // as well as the current user's membership in the team, so only
                // bail out if both of those are available for this team.
                const team = retrieveTeam(teamId, state.get('cache').toJS(), ['permissions']);
                const teamMembership = selectors.teamMembershipSelector(state)[teamId];
                return team && teamMembership;
            },
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
                types.GET_TEAM_MEMBERS_BAIL,
            ],
            remote: client => requests.getMembers(client, teamId, role, nextRequest),
            bailout: (state) => {
                const { bail, paginator } = paginatedShouldBail('teamMembers', teamId, nextRequest, state);
                if (bail && paginator) {
                    return {paginator};
                } else {
                    return bail;
                }
            },
        },
        meta: {
            paginateBy: teamId,
        },
    };
}

export function getMembersForProfileId(profileId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_TEAM_MEMBERS_FOR_PROFILE,
                types.GET_TEAM_MEMBERS_FOR_PROFILE_SUCCESS,
                types.GET_TEAM_MEMBERS_FOR_PROFILE_FAILURE,
            ],
            remote: client => requests.getMembersForProfileId(client, profileId),
            bailout: (state) => state.get('profileMemberships').has(profileId),
        },
        meta: {
            paginateBy: profileId,
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
            remote: client => requests.getMembers(client, teamId, role, nextRequest),
            bailout: (state) => {
                const { bail } = paginatedShouldBail('teamCoordinators', teamId, nextRequest, state);
                return bail;
            },
        },
        meta: {
            paginateBy: teamId,
        },
    };
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

/**
 * Update team members
 *
 * @param {String} teamId the id of the team
 * @param {Array[services.team.containers.TeamMemberV1]} members an array of team members
 *
 */
export function updateMembers(teamId, members) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_MEMBERS,
                types.UPDATE_MEMBERS_SUCCESS,
                types.UPDATE_MEMBERS_FAILURE,
            ],
            remote: (client) => requests.updateMembers(client, teamId, members),
        },
    };
}

/**
 * Remove team members
 *
 * @param {String} teamId the id of the team
 * @param {Array[String]} members an array of the profile ids of members to remove
 */
export function removeMembers(teamId, members) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.REMOVE_MEMBERS,
                types.REMOVE_MEMBERS_SUCCESS,
                types.REMOVE_MEMBERS_FAILURE,
            ],
            remote: (client) => requests.removeMembers(client, teamId, members),
        },
    };
}

/**
 * Join team
 *
 * @param {String} teamId the id of the team
 */
export function joinTeam(teamId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.JOIN_TEAM,
                types.JOIN_TEAM_SUCCESS,
                types.JOIN_TEAM_FAILURE,
            ],
            remote: (client) => requests.joinTeam(client, teamId),
        },
    };
}

/**
 * Leave team
 *
 * @param {String} teamId the id of the team
 * @param {String} memberId id of the team member
 */
export function leaveTeam(teamId, memberId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LEAVE_TEAM,
                types.LEAVE_TEAM_SUCCESS,
                types.LEAVE_TEAM_FAILURE,
            ],
            remote: (client) => requests.leaveTeam(client, teamId, memberId),
        },
    };
}

export function updateTeamSlug(team, previousSlug, nextSlug) {
    return {
        type: types.UPDATE_TEAM_SLUG,
        payload: {
            previousSlug,
            nextSlug,
            teamId: team.id,
        },
    };
}
