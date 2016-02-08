import { getTeamMemberNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

export default paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getTeamMemberNormalizations,
    types: [
        types.GET_TEAM_MEMBERS,
        types.GET_TEAM_MEMBERS_SUCCESS,
        types.GET_TEAM_MEMBERS_FAILURE,
    ],
});
