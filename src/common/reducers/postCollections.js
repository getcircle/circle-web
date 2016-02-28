import Immutable from 'immutable';

import { getCollectionsNormalizations } from './normalizations';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    posts: Immutable.Map(),
});

function updateStateForPost(state = Immutable.fromJS({loaded: false, ids: Immutable.OrderedSet()}), action) {
    switch (action.type) {
    case types.GET_COLLECTIONS_SUCCESS:
        const ids = getCollectionsNormalizations(action);
        return state.withMutations(map => map.set('loaded', true).update('ids', set => set.union(ids)));
    }
    return state;
}

export default function (state = initialState, action) {
    switch(action.type) {
    case types.GET_COLLECTIONS_SUCCESS:
        const key = action.payload.result;
        return state.mergeDeep({
            [key]: updateStateForPost(state.get(key), action),
        });
    }
    return state;
}
