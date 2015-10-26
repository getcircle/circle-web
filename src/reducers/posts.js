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
});
export default posts;
