import Immutable from 'immutable';
import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    ids: Immutable.Set(),
    collectionToItem: Immutable.Map(),
});

export default function (state = initialState, action) {
    switch(action.type) {
    case types.ADD_TO_COLLECTION_SUCCESS:
        return state.updateIn(['ids'], set => set.add(action.payload.item.collection_id))
            .updateIn(['collectionToItem'], map => map.set(action.payload.item.collection_id, action.payload.item.id));
    case types.REMOVE_FROM_COLLECTION_SUCCESS:
        debugger;
        return state.updateIn(['ids'], set => set.remove(action.payload.collectionId))
            .updateIn('collectionToItem', map => map.remove(action.payload.collectionId));
    }
    return state;
}
