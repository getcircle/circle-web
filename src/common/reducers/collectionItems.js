import { getCollectionItemsNormalizations } from './normalizations';
import paginate from './paginate';

import * as types from '../constants/actionTypes';

export default paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getCollectionItemsNormalizations,
    types: [
        types.GET_COLLECTION_ITEMS,
        types.GET_COLLECTION_ITEMS_SUCCESS,
        types.GET_COLLECTION_ITEMS_FAILURE,
    ],
});
