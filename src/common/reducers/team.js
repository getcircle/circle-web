import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    error: null,
    saving: false,
});

export default function updateTeam(state = initialState, action) {
    switch(action.type) {
    case types.CREATE_TEAM:
        return state.merge({
            error: '',
            saving: true,
        });

    case types.CREATE_TEAM_SUCCESS:
        return state.merge({
            error: '',
            saving: false,
        });

    case types.CREATE_TEAM_FAILURE:
        return state.merge({
            error: action.payload.message,
            saving: false,
        });

    default:
        return state;
    }
}
