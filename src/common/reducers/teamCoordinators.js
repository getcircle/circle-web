import {
    getTeamCoordinatorNormalizationsFromUpdateMembers,
    getTeamMemberNormalizationsFromUpdateMembers,
    getTeamCoordinatorNormalizationsFromAddMembers,
    getTeamCoordinatorNormalizations,
} from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';
import { services } from 'protobufs';

const { RoleV1 } = services.team.containers.TeamMemberV1;

function handleUpdateMembersSuccess(state, action) {
    // remove any coordinators that were updated to members
    const subtractIds = getTeamMemberNormalizationsFromUpdateMembers(action);
    // add any members that were updated to coordinators
    const addIds = getTeamCoordinatorNormalizationsFromUpdateMembers(action);
    return state.updateIn([action.payload.result, 'ids'], set => {
        return set.subtract(subtractIds)
            .union(addIds);
    });
}

function handleRemoveMembersSuccess(state, action) {
    // remove any coordinators that were removed
    const subtractIds = []
    action.payload.members.forEach((member) => {
        if (member.role === RoleV1.COORDINATOR) {
            subtractIds.push(member.id);
        }
    });
    return state.updateIn([action.payload.teamId, 'ids'], set => {
        return set.subtract(subtractIds);
    });
}

function additionalTypesCallback(state, action) {
    switch(action.type) {
    case types.ADD_MEMBERS_SUCCESS:
        const ids = getTeamCoordinatorNormalizationsFromAddMembers(action);
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
    mapActionToResults: getTeamCoordinatorNormalizations,
    types: [
        types.GET_TEAM_COORDINATORS,
        types.GET_TEAM_COORDINATORS_SUCCESS,
        types.GET_TEAM_COORDINATORS_FAILURE,
    ],
});
