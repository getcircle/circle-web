import { getTeamCoordinatorNormalizations } from './normalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

export default paginate({
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getTeamCoordinatorNormalizations,
    types: [
        types.GET_TEAM_COORDINATORS,
        types.GET_TEAM_COORDINATORS_SUCCESS,
        types.GET_TEAM_COORDINATORS_FAILURE,
    ],
});
