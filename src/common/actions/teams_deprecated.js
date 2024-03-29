import * as organizationRequests from '../services/organization';
import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import { getProfiles } from '../services/profile';
import { retrieveProfiles } from '../reducers/denormalizations';

export function loadExtendedTeam(teamId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_EXTENDED_TEAM,
                types.LOAD_EXTENDED_TEAM_SUCCESS,
                types.LOAD_EXTENDED_TEAM_FAILURE,
            ],
            remote: (client) => organizationRequests.getExtendedTeam(client, teamId),
        },
    };
}

export function loadTeamMembers(teamId, nextRequest=null) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_TEAM_MEMBERS,
                types.LOAD_TEAM_MEMBERS_SUCCESS,
                types.LOAD_TEAM_MEMBERS_FAILURE,
            ],
            /*eslint-disable camelcase */
            remote: (client) => getProfiles(client, {team_id: teamId}, nextRequest),
            /*eslint-enable camelcase */
            bailout: (state) => {
                if (state.get('teamMembers').has(teamId) && nextRequest === null) {
                    const ids = state.get('teamMembers').get(teamId).get('ids').toJS();
                    const members = retrieveProfiles(ids, state.get('cache').toJS());
                    return members !== null;
                }
            },
        },
        meta: {
            paginateBy: teamId,
        },
    };
}

export function updateTeam(team) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_TEAM,
                types.UPDATE_TEAM_SUCCESS,
                types.UPDATE_TEAM_FAILURE,
            ],
            remote: (client) => organizationRequests.updateTeam(client, team),
        },
    };
}

export function clearTeamMembers(teamId) {
    return {
        type: types.CLEAR_TEAM_MEMBERS_CACHE,
        payload: {
            teamId: teamId,
        },
    };
}
