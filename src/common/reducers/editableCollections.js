import Immutable from 'immutable';

import { getCollectionsNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    collectionIds: Immutable.Set(),
    loaded: false,
});

export default function (state = initialState, action) {
    switch(action.type) {
    case types.GET_EDITABLE_COLLECTIONS_SUCCESS:
        const ids = getCollectionsNormalizations(action);
        return state.withMutations(map => map.set('loaded', true).update('collectionIds', set => set.union(ids)));
    case types.CREATE_COLLECTION_SUCCESS:
        return state.update('collectionIds', set => set.add(action.payload.result));
    case types.DELETE_COLLECTION_SUCCESS:
        return state.update('collectionIds', set => set.remove(action.payload.collection.id));
    case types.CREATE_TEAM_SUCCESS:
        return state.update('collectionIds', set => set.add(action.payload.collectionId));
    }
    return state;
}
