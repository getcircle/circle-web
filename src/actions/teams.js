import { denormalize } from 'protobuf-normalizr';
import { services } from 'protobufs';

import * as organizationRequests from '../services/organization';
import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import { getProfiles } from '../services/profile';

export function loadExtendedTeam(teamId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_EXTENDED_TEAM,
                types.LOAD_EXTENDED_TEAM_SUCCESS,
                types.LOAD_EXTENDED_TEAM_FAILURE,
            ],
            remote: () => organizationRequests.getExtendedTeam(teamId),
            bailout: (state) => state.extendedTeams.getIn(['ids', teamId]),
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
            bailout: (state) => {
                if (state.teamMembers.has(teamId)) {
                    return state.teamMembers.get(teamId).get('ids').size > 0;
                }
            },
        },
        meta: {
            paginateBy: teamId,
        },
    };
}

export function retrieveExtendedTeam(teamId, cache) {
    const team = denormalize(teamId, services.organization.actions.get_team.ResponseV1, cache);
    const reportingDetails = denormalize(
        teamId,
        services.organization.actions.get_team_reporting_details.ResponseV1,
        cache
    );
    return {reportingDetails, team: team.team};
}

export function retrieveTeamMembers(profileIds, cache) {
    return denormalize(profileIds, services.profile.containers.ProfileV1, cache);
}

export function updateTeam(team) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_TEAM,
                types.UPDATE_TEAM_SUCCESS,
                types.UPDATE_TEAM_FAILURE,
            ],
            remote: () => organizationRequests.updateTeam(team),
        },
    };
}
