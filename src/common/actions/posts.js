import { services } from 'protobufs';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/posts';
import { paginatedShouldBail } from '../reducers/paginate';

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

export function getPostsPaginationKey(profileId, state) {
    return `${profileId ? profileId : 'all'}:${state}`;
}

export function getPosts(profileId, state, nextRequest) {
    const paginateBy = getPostsPaginationKey(profileId, state);
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_POSTS,
                types.GET_POSTS_SUCCESS,
                types.GET_POSTS_FAILURE,
                types.GET_POSTS_BAIL,
            ],
            remote: (client) => requests.getPosts({client, profileId, state, nextRequest}),
            bailout: (state) => {
                const { bail, paginator } = paginatedShouldBail('posts', paginateBy, nextRequest, state);
                if (bail && paginator) {
                    return { paginator };
                } else {
                    return bail;
                }
            },
        },
        meta: {paginateBy},
    };
}

export function getListedPostsPaginationKey(profileId) {
    const state = services.post.containers.PostStateV1.LISTED;
    return getPostsPaginationKey(profileId, state);
}

export function getListedPosts(profileId, nextRequest) {
    const state = services.post.containers.PostStateV1.LISTED;
    return getPosts(profileId, state, nextRequest);
}

export function clearPosts(postStateURLString, forProfile) {
    let key;
    if (postStateURLString === null || postStateURLString === undefined) {
        key = postStateURLString;
    } else {
        key = getPostsPaginationKey(postStateURLString, forProfile);
    }

    return {
        type: types.CLEAR_POSTS_CACHE,
        payload: {
            key: key,
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

export function showConfirmDeleteModal(post) {
    return {type: types.SHOW_CONFIRM_DELETE_MODAL, payload: post};
}

export function hideConfirmDeleteModal() {
    return {type: types.HIDE_CONFIRM_DELETE_MODAL};
}
