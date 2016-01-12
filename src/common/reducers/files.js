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

    case types.FILE_DELETE_SUCCESS:
        const fileId = action.payload.fileId;
        const file = state.get('files').find((file) => {
            return (file && file.id && file.id === fileId);
        });

        if (file) {
            return state.deleteIn(['files', file.name])
                        .deleteIn(['filesProgress', file.name])
                        .set('loading', false);
        }

    case types.CLEAR_FILE_UPLOADS:
        return initialState;
    }

    return state;
}
