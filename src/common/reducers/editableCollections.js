import Immutable from 'immutable';

import { getCollectionsNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    collectionIds: Immutable.Set(),
});

export default function (state = initialState, action) {
    switch(action.type) {
    case types.GET_EDITABLE_COLLECTIONS_SUCCESS:
        const ids = getCollectionsNormalizations(action);
        return state.update('collectionIds', set => set.union(ids));
    case types.CREATE_COLLECTION_SUCCESS:
        return state.update('collectionIds', set => set.add(action.payload.result));
    case types.DELETE_COLLECTION_SUCCESS:
        return state.update('collectionIds', set => set.remove(action.payload.result));
    }
    return state;
}
