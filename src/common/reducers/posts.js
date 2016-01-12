import Immutable from 'immutable';

import { getPostsNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

const posts = paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getPostsNormalizations,
    types: [
        types.GET_POSTS,
        types.GET_POSTS_SUCCESS,
        types.GET_POSTS_FAILURE,
    ],
    additionalTypesCallback: (state = Immutable.Map(), action) => {
        switch (action.type) {
        case types.DELETE_POST_SUCCESS:
            if (action.payload.postId && action.payload.postState !== undefined) {
                const postId = action.payload.postId;
                const postState = action.payload.postState;
                return state.updateIn([postState, 'ids'], set => {
                    return set ? set.delete(postId) : set;
                });
            }
            break;

        case types.CLEAR_POSTS_CACHE:
            if (action.payload.postState === null || action.payload.postState === undefined) {
                return Immutable.Map();
            } else if (action.payload.postState) {
                return state.deleteIn([action.payload.postState]);
            }
            break;
        }
        return state;
    }
});

export default posts;
