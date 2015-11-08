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
            remote: () => requests.uploadFile(fileName, contentType, data),
        },
    };
}
