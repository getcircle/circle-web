import { getProfileNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

const explore = paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getProfileNormalizations,
    types: [
        types.EXPLORE,
        types.EXPLORE_SUCCESS,
        types.EXPLORE_FAILURE,
    ],
});
export default explore;
