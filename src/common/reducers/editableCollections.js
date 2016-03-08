import Immutable from 'immutable';

import { getCollectionsNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    collectionIds: Immutable.Set(),
    loaded: false,
    loading: false,
});

export default function (state = initialState, action) {
    let ids;
    switch(action.type) {
    case types.GET_EDITABLE_COLLECTIONS:
        return state.set('loading', true);
    case types.GET_EDITABLE_COLLECTIONS_SUCCESS:
        ids = getCollectionsNormalizations(action);
        return state.withMutations(map => {
            map.merge({loaded: true, loading: false})
                .update('collectionIds', set => Immutable.Set(ids))
        });
    case types.CREATE_COLLECTION_SUCCESS:
        return state.update('collectionIds', set => set.add(action.payload.result));
    case types.DELETE_COLLECTION_SUCCESS:
        return state.update('collectionIds', set => set.remove(action.payload.collection.id));
    case types.CREATE_TEAM_SUCCESS:
        return state.update('collectionIds', set => set.add(action.payload.collectionId));
    case types.ADD_TO_COLLECTIONS_SUCCESS:
        ids = action.payload.collections.map(collection => collection.id);
        return state.update('collectionIds', set => set.union(ids));
    case types.UPDATE_MEMBERS_SUCCESS:
    case types.LEAVE_TEAM_SUCCESS:
    case types.REMOVE_MEMBERS_SUCCESS:
        return state.set('loaded', false);
    }
    return state;
}
