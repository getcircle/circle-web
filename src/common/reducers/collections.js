import paginate from './paginate';

import { getCollectionsForOwnerNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

export default paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getCollectionsForOwnerNormalizations,
    types: [
        types.GET_COLLECTIONS_FOR_OWNER,
        types.GET_COLLECTIONS_FOR_OWNER_SUCCESS,
        types.GET_COLLECTIONS_FOR_OWNER_FAILURE,
    ],
});
