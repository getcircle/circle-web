import { getTeamMemberNormalizations } from './normalizations';
import paginate, { rewind } from './paginate';
import * as types from '../constants/actionTypes';

import { SLUGS } from '../components/TeamDetailTabs';

function additionalTypes(state, action) {
    switch(action.type) {
    case types.UPDATE_TEAM_SLUG:
        const { payload: { previousSlug, teamId } } = action;
        if (previousSlug === SLUGS.PEOPLE) {
            return rewind(teamId, state);
        }
    }
    return state;
}

export default paginate({
    additionalTypesCallback: additionalTypes,
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getTeamMemberNormalizations,
    types: [
        types.GET_TEAM_MEMBERS,
        types.GET_TEAM_MEMBERS_SUCCESS,
        types.GET_TEAM_MEMBERS_FAILURE,
        types.GET_TEAM_MEMBERS_BAIL,
    ],
});
