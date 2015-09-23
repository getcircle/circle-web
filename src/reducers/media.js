import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    mediaUrl: '',
    loading: false,
});

export default function mediaUpload(state = initialState, action) {
    switch(action.type) {
    case types.MEDIA_UPLOAD:
        return Immutable.fromJS({
            mediaUrl: '',
            loading: true,
        });

    case types.MEDIA_UPLOAD_SUCCESS:
        return Immutable.fromJS({
            mediaUrl: action.payload,
            loading: false,
        });

    case types.MEDIA_UPLOAD_FAILURE:
        return Immutable.fromJS({
            mediaUrl: '',
            loading: false,
        });
    }

    return state;
}
