import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    mediaUrl: '',
    loading: false,
});

export default function mediaUpload(state = initialState, action) {
    switch(action.type) {
    case types.MEDIA_UPLOAD:
        return state.merge({
            mediaUrl: '',
            loading: true,
        });

    case types.MEDIA_UPLOAD_SUCCESS:
        return state.merge({
            mediaUrl: action.payload.mediaUrl,
            loading: false,
        });

    case types.MEDIA_UPLOAD_FAILURE:
        return state.merge({
            mediaUrl: '',
            loading: false,
        });

    case types.UPDATE_PROFILE_SUCCESS:
        // URL is relevant only while we are updating a profile
        // It should be cleared for the potential update profile
        // action in future.
        return state.merge({
            mediaUrl: '',
            loading: false,
        });
    }

    return state;
}
