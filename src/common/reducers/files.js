import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.Map({
    files: Immutable.Map(),
    progress: Immutable.Map(),
    loading: false,
});

export default function fileUpload(state = initialState, action) {
    switch(action.type) {
    case types.FILE_UPLOAD:
        return state.set('loading', true);

    case types.FILE_UPLOAD_SUCCESS:
        return state.setIn(['files', action.payload.name], action.payload)
                    .deleteIn(['progress', action.payload.name])
                    .set('loading', false);

    case types.FILE_UPLOAD_FAILURE:
        return state.set('loading', false);

    case types.FILE_UPLOAD_PROGRESS:
        return state.setIn(['progress', action.payload.name], action.payload.progress);

    case types.FILE_DELETE_SUCCESS:
        const fileIds = action.payload.fileIds;
        const fileIdsLength = fileIds.length;
        if (state.get('files').size === 0) {
            return state;
        }

        let modifiedState = state.withMutations((stateMap) => {
            let internalModifiedState = stateMap;
            let fileId;
            for (let i = 0; i < fileIdsLength; i++) {
                fileId = fileIds[i];
                const file = internalModifiedState.get('files').find((file) => {
                    return (file && file.id && file.id === fileId);
                });

                if (file) {
                    internalModifiedState = internalModifiedState.deleteIn(['files', file.name])
                                                                 .deleteIn(['progress', file.name]);
                }
            }
        });

        return  modifiedState.set('loading', false);


    case types.CLEAR_FILE_UPLOADS:
        return initialState;
    }

    return state;
}
