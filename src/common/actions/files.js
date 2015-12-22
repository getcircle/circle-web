import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/file';

export function uploadFile(fileName, contentType, data) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.FILE_UPLOAD,
                types.FILE_UPLOAD_SUCCESS,
                types.FILE_UPLOAD_FAILURE,
            ],
            remote: (client, state, dispatch) => requests.uploadFile(client, fileName, contentType, data, dispatch),
        },
    };
}

export function deleteFile(file) {
    return {
        type: types.DELETE_LOCAL_FILE,
        payload: {
            file: file,
        },
    };
}

export function clearFileUploads() {
    return {
        type: types.CLEAR_FILE_UPLOADS,
    }
}

export function reportFileUploadProgress(fileName, progress) {
    return {
        type: types.FILE_UPLOAD_PROGRESS,
        payload: {
            name: fileName,
            progress: progress,
        },
    };
}
