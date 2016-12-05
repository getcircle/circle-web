import Immutable from 'immutable';

import paginate from './paginate';

import { getCollectionsForOwnerKey } from '../services/posts';
import { getCollectionsForOwnerNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

function additionalTypesCallback(state, action) {
    let collection, key;
    switch (action.type) {
    case types.DELETE_COLLECTION_SUCCESS:
        collection = action.payload.collection;
        key = getCollectionsForOwnerKey(collection.owner_type, collection.owner_id);
        return state.updateIn([key, 'ids'], set => set ? set.delete(collection.id) : set);
    case types.CREATE_COLLECTION_SUCCESS:
        collection = action.payload.collection;
        key = getCollectionsForOwnerKey(collection.owner_type, collection.owner_id);
        return state.updateIn([key, 'ids'], set => set ? set.add(collection.id) : set);
    case types.REORDER_COLLECTIONS_SUCCESS:
        key = action.payload.result;
        const { payload: { diffs } } = action;
        return state.updateIn([key, 'ids'], set => {
            const ids = set.toJS();
            for (let diff of diffs) {
                let currentPosition;
                for (let index in ids) {
                    if (ids[index] === diff.item_id) {
                        currentPosition = index;
                        break;
                    }
                }
                ids.splice(currentPosition, 1);
                ids.splice(diff.new_position, 0, diff.item_id);
            }
            return Immutable.OrderedSet(ids);
        });
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
