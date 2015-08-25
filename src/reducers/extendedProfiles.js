import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    ids: Immutable.Set(),
});

export default function extendedProfiles(state = initialState, action) {
    switch(action.type) {
    case types.LOAD_EXTENDED_PROFILE_SUCCESS:
        return state.updateIn(['ids'], set => set.add(action.payload.result));
    default:
        return state;
    }
}
