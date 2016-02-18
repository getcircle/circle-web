import Immutable from 'immutable';

import { getPostsNormalizations } from './normalizations';
import paginate from './paginate';

import { getPostsPaginationKey } from '../actions/posts';
import * as types from '../constants/actionTypes';

function additionalTypes(state, action) {
    switch (action.type) {
    case types.DELETE_POST_SUCCESS:
        if (action.payload.postId &&
            action.payload.postState !== undefined &&
            action.payload.postAuthorId !== undefined
        ) {
            const postId = action.payload.postId;
            const postState = action.payload.postState;
            const key = getPostsPaginationKey(postState, {
                id: action.payload.postAuthorId,
            })
            return state.updateIn([key, 'ids'], set => {
                return set ? set.delete(postId) : set;
            });
        }
        break;

    case types.CLEAR_POSTS_CACHE:
        if (action.payload.key === null || action.payload.key === undefined) {
            return Immutable.Map();
        } else if (action.payload.key) {
            return state.deleteIn([action.payload.key]);
        }
        break;
    }
    return state;
}

const posts = paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getPostsNormalizations,
    types: [
        types.GET_POSTS,
        types.GET_POSTS_SUCCESS,
        types.GET_POSTS_FAILURE,
    ],
    additionalTypesCallback: additionalTypes,
});

export default posts;
