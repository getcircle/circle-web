import {
    getTeamCoordinatorNormalizationsFromUpdateMembers,
    getTeamMemberNormalizationsFromUpdateMembers,
    getTeamMemberNormalizationsFromAddMembers,
    getTeamMemberNormalizations,
} from './normalizations';
import paginate, { rewind } from './paginate';
import * as types from '../constants/actionTypes';

import { SLUGS } from '../components/TeamDetailTabs';

function handleUpdateMembersSuccess(state, action) {
    // remove any members that were updated to coordinators
    const subtractIds = getTeamCoordinatorNormalizationsFromUpdateMembers(action);
    // add any coordinators that were updated to members
    const addIds = getTeamMemberNormalizationsFromUpdateMembers(action);
    return state.updateIn([action.payload.result, 'ids'], set => {
        return set.subtract(subtractIds)
            .union(addIds);
    });
}

function handleRemoveMembersSuccess(state, action) {
    // remove any members that were removed
    const subtractIds = []
    action.payload.members.forEach((member) => {
        if (member.role === null) {
            subtractIds.push(member.id);
        }
    })
    return state.updateIn([action.payload.teamId, 'ids'], set => {
        return set.subtract(subtractIds);
    });
}

function additionalTypesCallback(state, action) {
    switch(action.type) {
    case types.UPDATE_TEAM_SLUG:
        const { payload: { previousSlug, teamId } } = action;
        if (previousSlug === SLUGS.PEOPLE) {
            return rewind(teamId, state);
        }
        break;
    case types.ADD_MEMBERS_SUCCESS:
        const ids = getTeamMemberNormalizationsFromAddMembers(action);
        return state.updateIn([action.payload.result, 'ids'], set => set.union(ids));
    case types.UPDATE_MEMBERS_SUCCESS:
        return handleUpdateMembersSuccess(state, action);
    case types.REMOVE_MEMBERS_SUCCESS:
        return handleRemoveMembersSuccess(state, action);
    }
    return state;
}

export default paginate({
    additionalTypesCallback,
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getTeamMemberNormalizations,
    types: [
        types.GET_TEAM_MEMBERS,
        types.GET_TEAM_MEMBERS_SUCCESS,
        types.GET_TEAM_MEMBERS_FAILURE,
        types.GET_TEAM_MEMBERS_BAIL,
    ],
});
