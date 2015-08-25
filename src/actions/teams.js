import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import { getExtendedTeam } from '../services/organization';
import { getProfiles } from '../services/profile';

export function loadExtendedTeam(teamId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_EXTENDED_TEAM,
                types.LOAD_EXTENDED_TEAM_SUCCESS,
                types.LOAD_EXTENDED_TEAM_FAILURE,
            ],
            remote: () => getExtendedTeam(teamId),
            bailout: (state) => state.extendedTeams.getIn(['objects', teamId]),
        },
    };
}

export function loadTeamMembers(teamId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_TEAM_MEMBERS,
                types.LOAD_TEAM_MEMBERS_SUCCESS,
                types.LOAD_TEAM_MEMBERS_FAILURE,
            ],
            /*eslint-disable camelcase */
            remote: () => getProfiles({team_id: teamId}),
            /*eslint-enable camelcase */
        },
    };
}
