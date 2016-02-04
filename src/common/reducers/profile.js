import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    formSubmitting: false,
    modalVisible: false,
});

export default function updateProfile(state = initialState, action) {
    switch(action.type) {
    case types.UPDATE_PROFILE, types.MEDIA_UPLOAD:
        return state.merge({formSubmitting: true});

    case types.UPDATE_PROFILE_FAILURE:
        return state.merge({formSubmitting: false});

    case types.UPDATE_PROFILE_SUCCESS:
        return state.merge({
            formSubmitting: false,
            modalVisible: false,
        });

    case types.MODAL_UPDATE_PROFILE_SHOW:
        return state.merge({modalVisible: true});

    case types.MODAL_UPDATE_PROFILE_HIDE:
        return state.merge({modalVisible: false});

    default:
        return state;
    }
}
