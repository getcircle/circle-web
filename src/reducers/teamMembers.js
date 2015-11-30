import { getProfileNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

const teamMembers = paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getProfileNormalizations,
    types: [
        types.LOAD_TEAM_MEMBERS,
        types.LOAD_TEAM_MEMBERS_SUCCESS,
        types.LOAD_TEAM_MEMBERS_FAILURE,
    ],
    additionalTypesCallback: (state = Immutable.Map(), action) => {
        switch (action.type) {
        case types.CLEAR_TEAM_MEMBERS_CACHE:
            if (action.payload.teamId) {
                return state.deleteIn([action.payload.teamId]);
            }
            break;
        }
        return state;
    },
});
export default teamMembers;
