import Immutable from 'immutable';

import { getCollectionsNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

const initialState = Immutable.Map();

function updateStateForPost(state = Immutable.fromJS({loaded: false, ids: Immutable.OrderedSet()}), action) {
    let ids;
    switch (action.type) {
    case types.GET_COLLECTIONS_SUCCESS:
        ids = getCollectionsNormalizations(action);
        if (ids) {
            return state.withMutations(map => map.set('loaded', true).update('ids', set => set.union(ids)));
        }
        break;
    case types.ADD_TO_COLLECTIONS_SUCCESS:
        ids = action.payload.collections.map(collection => collection.id);
        return state.update('ids', set => set.union(ids));
    case types.REMOVE_FROM_COLLECTIONS_SUCCESS:
        ids = action.payload.collections.map(collection => collection.id);
        return state.update('ids', set => set.subtract(ids));
    }
    return state;
}

export default function (state = initialState, action) {
    switch(action.type) {
    case types.ADD_TO_COLLECTIONS_SUCCESS:
    case types.REMOVE_FROM_COLLECTIONS_SUCCESS:
    case types.GET_COLLECTIONS_SUCCESS:
        const key = action.payload.result;
        return state.merge({
            [key]: updateStateForPost(state.get(key), action),
        });
    }
    return state;
}
