import {
    getPostsNormalizations,
    getProfileNormalizations,
    getTeamNormalizations,
} from './normalizations';
import { EXPLORE_TYPES } from '../actions/explore';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

const explore = paginate({
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
