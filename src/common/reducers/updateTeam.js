import Immutable from 'immutable';

import * as types from '../constants/actionTypes';
import * as forms from '../constants/forms';

const initialState = Immutable.fromJS({
    updateComplete: false,
    formSubmitting: false,
    id: undefined,
    modalVisible: false,
});

export default function updateTeam(state = initialState, action) {
    switch(action.type) {
    case types.RESET_FORM:
        if (action.form === forms.EDIT_TEAM) {
            return state.merge({
                formSubmitting: false,
                id: undefined,
                updateComplete: false,
            });
        }

    case types.UPDATE_TEAM:
        return state.merge({formSubmitting: true});

    case types.UPDATE_TEAM_SUCCESS:
        return state.merge({
            id: action.payload.result,
            formSubmitting: false,
            modalVisible: false,
            updateComplete: true,
        });

    case types.UPDATE_TEAM_FAILURE:
        return state.merge({formSubmitting: false});

    case types.MODAL_TEAM_EDIT_SHOW:
        return state.merge({modalVisible: true});

    case types.MODAL_TEAM_EDIT_HIDE:
        return state.merge({modalVisible: false});

    default:
        return state;
    }
}
