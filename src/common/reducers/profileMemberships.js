import { getTeamMemberForProfileNormalizations, getTeamMemberNormalizationsFromCreateTeam } from './normalizations';
import { retrieveTeamMembers } from './denormalizations';
import paginate from './paginate';
import * as types from '../constants/actionTypes';

function additionalTypesCallback(state, action) {
    switch(action.type) {
    case types.CREATE_TEAM_SUCCESS:
        const ids = getTeamMemberNormalizationsFromCreateTeam(action);
        if (ids) {
            return state.withMutations(map => {
                const members = retrieveTeamMembers(ids, action.payload);
                for (let member of members) {
                    if (map.has(member.profile_id)) {
                        map.updateIn([member.profile_id, 'ids'], set => set.add(member.id));
                    }
                }
                return map;
            });
        }
    }
    return state;
}

export default paginate({
    additionalTypesCallback,
    mapActionToKey: action => action.meta.paginateBy,
    mapActionToResults: getTeamMemberForProfileNormalizations,
    types: [
        types.GET_TEAM_MEMBERS_FOR_PROFILE,
        types.GET_TEAM_MEMBERS_FOR_PROFILE_SUCCESS,
        types.GET_TEAM_MEMBERS_FOR_PROFILE_FAILURE,
    ],
});
