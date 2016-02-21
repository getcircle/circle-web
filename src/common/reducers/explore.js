import {
    getPostsNormalizations,
    getProfileNormalizations,
    getTeamNormalizations,
} from './normalizations';
import { EXPLORE_TYPES } from '../actions/explore';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

function additionalTypesCallback(state, action) {
    switch (action.type) {
    case types.DELETE_POST_SUCCESS:
        const { post } = action.payload;
        return state.updateIn([EXPLORE_TYPES.POSTS, 'ids'], set => set ? set.delete(post.id) : set);
    }
    return state;
}

const explore = paginate({
    additionalTypesCallback: additionalTypesCallback,
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: (action) => {
        switch(action.meta.paginateBy) {
        case EXPLORE_TYPES.POSTS:
            return getPostsNormalizations(action);
        case EXPLORE_TYPES.PROFILES:
            return getProfileNormalizations(action);
        case EXPLORE_TYPES.TEAMS:
            return getTeamNormalizations(action);
        }
    },
    types: [
        types.EXPLORE,
        types.EXPLORE_SUCCESS,
        types.EXPLORE_FAILURE,
    ],
});
export default explore;
