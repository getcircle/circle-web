import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    formSubmitting: false,
    modalVisible: false,
});

export default function updateTeam(state = initialState, action) {
    switch(action.type) {
    case types.CREATE_TEAM:
        return state.merge({formSubmitting: true});

    case types.CREATE_TEAM_SUCCESS:
        return state.merge({
            formSubmitting: false,
            modalVisible: false,
        });

    case types.CREATE_TEAM_FAILURE:
        return state.merge({formSubmitting: false});

    case types.MODAL_CREATE_TEAM_SHOW:
        return state.merge({modalVisible: true});

    case types.MODAL_CREATE_TEAM_HIDE:
        return state.merge({modalVisible: false});

    default:
        return state;
    }
}
