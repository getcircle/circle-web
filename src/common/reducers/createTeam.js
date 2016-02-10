import Immutable from 'immutable';

import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

const initialState = Immutable.fromJS({
    formSubmitting: false,
    id: undefined,
    modalVisible: false,
});

export default function createTeam(state = initialState, action) {
    switch(action.type) {
    case types.RESET_FORM:
        if (action.form === forms.CREATE_TEAM) {
            return state.merge({
                formSubmitting: false,
                id: undefined,
            });
        }

    case types.CREATE_TEAM:
        return state.merge({formSubmitting: true});

    case types.CREATE_TEAM_SUCCESS:
        return state.merge({
            id: action.payload.result,
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
