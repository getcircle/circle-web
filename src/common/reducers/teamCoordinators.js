import { getTeamCoordinatorNormalizationsFromAddMembers, getTeamCoordinatorNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

function additionalTypesCallback(state, action) {
    switch(action.type) {
    case types.ADD_MEMBERS_SUCCESS:
        const ids = getTeamCoordinatorNormalizationsFromAddMembers(action);
        return state.updateIn([action.payload.result, 'ids'], set => set.union(ids));
        break;
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
