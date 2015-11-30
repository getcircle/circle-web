import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    error: null,
    saving: false,
});

export default function updateProfile(state = initialState, action) {
    switch(action.type) {
    case types.UPDATE_PROFILE:
        return state.merge({
            error: null,
            saving: true,
        });

    case types.UPDATE_PROFILE_FAILURE:
        return state.merge({
            error: action.payload,
            saving: false,
        });

    case types.UPDATE_PROFILE_SUCCESS:
        return state.merge({
            error: null,
            saving: false,
        });

    default:
        return state;
    }
}
