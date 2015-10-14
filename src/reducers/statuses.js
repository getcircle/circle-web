import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    ids: Immutable.Set(),
});

export default function statuses(state = initialState, action) {
    switch(action.type) {
    case types.LOGOUT_SUCCESS:
        return initialState;
    case types.LOAD_STATUS_SUCCESS:
        return state.updateIn(['ids'], set => set.add(action.payload.result));
    default:
        return state;
    }
}
