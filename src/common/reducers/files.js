import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.Map({
    files: Immutable.Map(),
    filesProgress: Immutable.Map(),
    loading: false,
});

export default function fileUpload(state = initialState, action) {
    switch(action.type) {
    case types.FILE_UPLOAD:
        return state.set('loading', true);

    case types.FILE_UPLOAD_SUCCESS:
        return state.setIn(['files', action.payload.name], action.payload)
                    .deleteIn(['filesProgress', action.payload.name])
                    .set('loading', false);

    case types.FILE_UPLOAD_FAILURE:
        return state.set('loading', false);

    case types.FILE_UPLOAD_PROGRESS:
        return state.setIn(['filesProgress', action.payload.name], action.payload.progress);

    case types.DELETE_LOCAL_FILE:
        return state.deleteIn(['files', action.payload.file.name])
                    .deleteIn(['filesProgress', action.payload.file.name])
                    .set('loading', false);

    case types.CLEAR_FILE_UPLOADS:
        return initialState;
    }

    return state;
}
