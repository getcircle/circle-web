import Immutable from 'immutable';

import { getPostsNormalizations } from './normalizations';
import paginate, { rewind } from './paginate';

import { getPostsPaginationKey, getListedPostsPaginationKey } from '../actions/posts';
import * as types from '../constants/actionTypes';

import { SLUGS } from '../components/ProfileDetailTabs';

function additionalTypes(state, action) {
    switch (action.type) {
    case types.DELETE_POST_SUCCESS:
        const { post } = action.payload;
        const key = getPostsPaginationKey(post.by_profile_id, post.state);
        return state.updateIn([key, 'ids'], set => set ? set.delete(post.id) : set);
    case types.CLEAR_POSTS_CACHE:
        if (action.payload.key === null || action.payload.key === undefined) {
            return Immutable.Map();
        } else if (action.payload.key) {
            return state.deleteIn([action.payload.key]);
        }
    case types.UPDATE_PROFILE_SLUG:
        const { payload: { previousSlug, profileId } } = action;
        if (previousSlug === SLUGS.KNOWLEDGE) {
            const key = getListedPostsPaginationKey(profileId);
            return rewind(key, state);
        }
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
        types.GET_POSTS_BAIL,
    ],
    additionalTypesCallback: additionalTypes,
});

export default posts;
