import { getTeamMemberForProfileNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

export default paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getTeamMemberForProfileNormalizations,
    types: [
        types.GET_TEAM_MEMBERS_FOR_PROFILE,
        types.GET_TEAM_MEMBERS_FOR_PROFILE_SUCCESS,
        types.GET_TEAM_MEMBERS_FOR_PROFILE_FAILURE,
    ],
});
