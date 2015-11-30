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
            remote: (client) => requests.createPost(client, post),
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
            remote: (client) => requests.updatePost(client, post),
        },
    };
}

export function getPosts(postStateURLString, byProfile, nextRequest) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_POSTS,
                types.GET_POSTS_SUCCESS,
                types.GET_POSTS_FAILURE,
            ],
            remote: (client) => requests.getPosts(client, postStateURLString, byProfile, nextRequest),
        },
        meta: {
            paginateBy: postStateURLString,
        },
    };
}

export function clearPosts(postStateURLString) {
    return {
        type: types.CLEAR_POSTS_CACHE,
        payload: {
            postState: postStateURLString,
        },
    };
}

export function getPost(postId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_POST,
                types.GET_POST_SUCCESS,
                types.GET_POST_FAILURE,
            ],
            remote: (client) => requests.getPost(client, postId),
        },
    };
}

export function deletePost(post) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.DELETE_POST,
                types.DELETE_POST_SUCCESS,
                types.DELETE_POST_FAILURE,
            ],
            remote: (client) => requests.deletePost(client, post),
        },
    };
}
