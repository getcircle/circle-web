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
});
export default teamMembers;
