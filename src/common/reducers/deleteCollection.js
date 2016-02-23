import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    pendingCollectionToDelete: null,
});

export default function (state = initialState, action) {
    switch(action.type) {
    case types.HIDE_CONFIRM_DELETE_COLLECTION_MODAL:
        return state.set('pendingCollectionToDelete', null);
    case types.SHOW_CONFIRM_DELETE_COLLECTION_MODAL:
        return state.set('pendingCollectionToDelete', action.payload);
    }
    return state;
}
