import * as types from '../constants/actionTypes';
import { getExtendedTeam } from '../services/organization';

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
