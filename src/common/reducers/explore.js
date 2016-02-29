import {
    getPostsNormalizations,
    getProfileNormalizations,
    getTeamNormalizations,
} from './normalizations';
import { EXPLORE_TYPES } from '../actions/explore';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

function additionalTypesCallback(state, action) {
    let post;
    switch (action.type) {
    case types.DELETE_POST_SUCCESS:
        post = action.payload.post;
        return state.updateIn([EXPLORE_TYPES.POSTS, 'ids'], set => set ? set.delete(post.id) : set);
    case types.CREATE_POST_SUCCESS:
        post = action.payload.post;
        return state.updateIn([EXPLORE_TYPES.POSTS, 'ids'], set => set ? set.add(post.id) : set);
    case types.CREATE_TEAM_SUCCESS:
        return state.updateIn([EXPLORE_TYPES.TEAMS, 'ids'], set => set ? set.add(action.payload.result) : set);
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
