import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/posts';

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

export function getPosts(postState, nextRequest) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_POSTS,
                types.GET_POSTS_SUCCESS,
                types.GET_POSTS_FAILURE,
            ],
            remote: () => requests.getPosts(postState, nextRequest),
            bailout: (state) => {
                if (state.posts.has(postState) && nextRequest === null) {
                    return state.posts.get(postState).get('ids').size > 0;
                }
            },
        },
        meta: {
            paginateBy: postState.toString(),
        },
    };
}
