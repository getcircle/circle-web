import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/post';

export function createPost(post) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.CREATE_POST,
                types.CREATE_POST_SUCCESS,
                types.CREATE_POST_FAILURE,
            ],
            remote: () => requests.createPost(post),
        },
    };
}

export function updatePost(post) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_POST,
                types.UPDATE_POST_SUCCESS,
                types.UPDATE_POST_FAILURE,
            ],
            remote: () => requests.updatePost(post),
        },
    };
}
