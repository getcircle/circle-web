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
