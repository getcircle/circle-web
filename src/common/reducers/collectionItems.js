import { getNormalizations } from 'protobuf-normalizr';
import { getCollectionItemsNormalizations, getCollectionsForOwnerNormalizations } from './normalizations';
import paginate from './paginate';
import { services } from 'protobufs';
import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

// TODO track adding items to a collection
function additionalTypesCallback(state, action) {
    switch(action.type) {
    case types.GET_COLLECTIONS_FOR_OWNER_SUCCESS:
        const collectionIds = getCollectionsForOwnerNormalizations(action);
        if (collectionIds && collectionIds.length) {
            return state.withMutations(map => {
                for (let collectionId of collectionIds) {
                    const itemIds = getNormalizations(
                        'items',
                        collectionId,
                        services.post.containers.CollectionV1,
                        action.payload,
                    );
                    if (itemIds) {
                        // collectionId should map to value used in
                        // `mapActionToKey` below (which is collectionId)
                        map.updateIn([collectionId, 'ids'], set => set ? set.union(itemIds) : Immutable.OrderedSet(itemIds));
                    }
                }
                return map;
            });
        }
    case types.UPDATE_COLLECTION_SUCCESS:
        const { payload: { removedItems, diffs } } = action;
        if ((removedItems && removedItems.length) || (diffs && diffs.length)) {
            return state.withMutations(map => {
                if (removedItems) {
                    const itemIds = removedItems.map(item => item.id);
                    map.updateIn([action.payload.result, 'ids'], set => set.subtract(itemIds));
                }

                if (diffs) {
                    const ids = map.getIn([action.payload.result, 'ids']).toJS();
                    for (let diff of diffs) {
                        let currentPosition;
                        for (let index in ids) {
                            if (ids[index] === diff.item_id) {
                                currentPosition = index;
                                break;
                            }
                        }
                        // remove the item from the array
                        ids.splice(currentPosition, 1);
                        // insert it at its new position
                        ids.splice(diff.new_position, 0, diff.item_id);
                    }
                    map.setIn([action.payload.result, 'ids'], Immutable.OrderedSet(ids));
                }
                return map;
            });
        }
    }
    return state;
};

export default paginate({
    additionalTypesCallback,
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getCollectionItemsNormalizations,
    types: [
        types.GET_COLLECTION_ITEMS,
        types.GET_COLLECTION_ITEMS_SUCCESS,
        types.GET_COLLECTION_ITEMS_FAILURE,
    ],
});
