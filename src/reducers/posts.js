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
                    return state.mergeDeep({
                        [postState]: state.get(postState).updateIn(['ids'], set => set.delete(postId))
                    });
                }
                break;
        }
        return state;
    }
});

export default posts;
