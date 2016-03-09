import { getNormalizations } from 'protobuf-normalizr';
import { getCollectionItemsNormalizations, getCollectionsForOwnerNormalizations } from './normalizations';
import paginate from './paginate';
import { services } from 'protobufs';
import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

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
                    // collectionId should map to value used in
                    // `mapActionToKey` below (which is collectionId)
                    map.updateIn([collectionId, 'ids'], set => set ? set.union(itemIds) : Immutable.OrderedSet(itemIds));
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
