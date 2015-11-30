import { getProfileNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

const profiles = paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getProfileNormalizations,
    types: [
        types.LOAD_PROFILES,
        types.LOAD_PROFILES_SUCCESS,
        types.LOAD_PROFILES_FAILURE,
    ],
});
export default profiles;
