import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    modalVisible: false,
    pendingPostToDelete: null,
});

export default function myKnowledge(state = initialState, action) {
    switch(action.type) {
    case types.HIDE_CONFIRM_DELETE_MODAL:
        return state.set('modalVisible', false).set('pendingPostToDelete', null);
    case types.SHOW_CONFIRM_DELETE_MODAL:
        return state.set('modalVisible', true).set('pendingPostToDelete', action.payload);
    }
    return state;
}
