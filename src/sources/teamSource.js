'use strict';

import { getProfilesForTeamId } from '../services/profile';

import {
    getTeam,
    getTeamDescendants,
} from '../services/organization';

const teamSource = (alt) => {
    return {

        fetchTeamMembers: {

            remote(state, teamId, nextRequest) {
                return getProfilesForTeamId(teamId, nextRequest);
            },

            local(state, teamId, nextRequest) {
                if (!nextRequest) {
                    return state.teamMembers[teamId] ? state.teamMembers : null;
                }
            },

            loading: alt.actions.TeamActions.loading,
            success: alt.actions.TeamActions.fetchTeamMembersSuccess,
            error: alt.actions.TeamActions.fetchTeamMembersError,
        },

        fetchTeam: {

            remote(state, teamId) {
                return getTeam(teamId);
            },

            local(state, teamId) {
                return state.teams[teamId] ? state.teams : null;
            },

            loading: alt.actions.TeamActions.loading,
            success: alt.actions.TeamActions.fetchTeamSuccess,
            error: alt.actions.TeamActions.fetchTeamError,
        },

        fetchTeamDescendants: {

            remote(state, teamId) {
                return getTeamDescendants(teamId);
            },

            local(state, teamId) {
                return state.teamDescendants[teamId] ? state.teamDescendants : null;
            },

            loading: alt.actions.TeamActions.loading,
            success: alt.actions.TeamActions.fetchTeamDescendantsSuccess,
            error: alt.actions.TeamActions.fetchTeamDescendantsError,
        },

    };
};

export default teamSource;
