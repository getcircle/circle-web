import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    loading: false,
    nextRequest: Immutable.Map(),
    members: Immutable.Map(),
}) 

const handleLoadTeamMembersSuccess = (state, action) => {
    const {
        parameters,
        profiles,
        nextRequest,
    } = action.payload;
    return state.withMutations(map => {
        map.update('members', map => {
            const teamId = parameters.team_id;
            if (map.has(teamId)) {
                return map.update(teamId, list => list.concat(profiles));
            } else {
                return map.set(teamId, profiles);
            }
        })
            .set('loading', false)
            .set('nextRequest', nextRequest);
    });
}

export default function teamMembers(state=initialState, action) {
    switch (action.type) {
    case types.LOAD_TEAM_MEMBERS:
        return state.set('loading', true);

    case types.LOAD_TEAM_MEMBERS_SUCCESS:
        return handleLoadTeamMembersSuccess(state, action);

    case types.LOAD_TEAM_MEMBERS_FAILURE:
        return state.set('loading', false);
    }
    return state;
}
