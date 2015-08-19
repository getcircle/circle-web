import * as types from '../constants/actionTypes';
import { getExtendedTeam } from '../services/organization';
import { getProfiles } from '../services/profile';

export function loadExtendedTeam(teamId) {
    return {
        types: [
            types.LOAD_EXTENDED_TEAM,
            types.LOAD_EXTENDED_TEAM_SUCCESS,
            types.LOAD_EXTENDED_TEAM_FAILURE,
        ],
        fetch: () => getExtendedTeam(teamId),
        shouldFetch: (state) => !state.extendedTeams.getIn(['objects', teamId]),
    }
}

export function loadTeamMembers(teamId) {
    return {
        types: [
            types.LOAD_TEAM_MEMBERS,
            types.LOAD_TEAM_MEMBERS_SUCCESS,
            types.LOAD_TEAM_MEMBERS_FAILURE,
        ],
        fetch: () => getProfiles({team_id: teamId}),
    }
}
