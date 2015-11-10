import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.Map({
    files: Immutable.Map(),
    loading: false,
});

export default function fileUpload(state = initialState, action) {
    switch(action.type) {
    case types.FILE_UPLOAD:
        return state.set('loading', true);

    case types.FILE_UPLOAD_SUCCESS:
        return state.setIn(['files', action.payload.name], action.payload)
                    .set('loading', false);

    case types.FILE_UPLOAD_FAILURE:
        return state.set('loading', false);
    }

    return state;
}
