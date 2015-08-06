import { getProfilesForTeamId } from '../services/profile';

import {
    getTeam,
    getTeams,
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

        fetchDepartments: {

            remote(state) {
                return getTeams({'top_level_only': true});
            },

            local(state) {
                return state.departments.length ? state.departments : null;
            },

            loading: alt.actions.TeamActions.loading,
            success: alt.actions.TeamActions.fetchDepartmentsSuccess,
            error: alt.actions.TeamActions.fetchDepartmentsError,
        },

    };
};

export default teamSource;
