import paginate from './paginate';

import { getCollectionsForOwnerKey } from '../services/posts';
import { getCollectionsForOwnerNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

function additionalTypesCallback(state, action) {
    switch (action.type) {
    case types.DELETE_COLLECTION_SUCCESS:
        const { collection } = action.payload;
        const key = getCollectionsForOwnerKey(collection.owner_type, collection.owner_id);
        return state.updateIn([key, 'ids'], set => set ? set.delete(collection.id) : set);
    }
    return state;
}

export default paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getCollectionsForOwnerNormalizations,
    types: [
        types.GET_COLLECTIONS_FOR_OWNER,
        types.GET_COLLECTIONS_FOR_OWNER_SUCCESS,
        types.GET_COLLECTIONS_FOR_OWNER_FAILURE,
    ],
    additionalTypesCallback: additionalTypesCallback,
});
