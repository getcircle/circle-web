import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/media';

export function uploadMedia(data, mediaType, mediaKey) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.MEDIA_UPLOAD,
                types.MEDIA_UPLOAD_SUCCESS,
                types.MEDIA_UPLOAD_FAILURE,
            ],
            remote: () => requests.uploadMedia(data, mediaType, mediaKey),
        },
    };
}
