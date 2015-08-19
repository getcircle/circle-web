import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    loading: false,
    nextRequest: Immutable.Map(),
    members: Immutable.Map(),
}) 

const handleLoadLocationMembersSuccess = (state, action) => {
    const {
        parameters,
        profiles,
        nextRequest,
    } = action.payload;
    return state.withMutations(map => {
        map.update('members', map => {
            return map.set(parameters.location_id, profiles);
        })
            .set('loading', false)
            .set('nextRequest', nextRequest);
    });
}

export default function locationMembers(state=initialState, action) {
    switch (action.type) {
    case types.LOAD_LOCATION_MEMBERS:
        return state.set('loading', true);

    case types.LOAD_LOCATION_MEMBERS_SUCCESS:
        return handleLoadLocationMembersSuccess(state, action);

    case types.LOAD_LOCATION_MEMBERS_FAILURE:
        return state.set('loading', false);
    }
    return state;
}