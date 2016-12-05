import { getProfileNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

const locationMembers = paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getProfileNormalizations,
    types: [
        types.LOAD_LOCATION_MEMBERS,
        types.LOAD_LOCATION_MEMBERS_SUCCESS,
        types.LOAD_LOCATION_MEMBERS_FAILURE,
    ],
});
export default locationMembers;
