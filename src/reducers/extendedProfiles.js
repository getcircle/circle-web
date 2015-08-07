import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    loading: false,
    objects: {},
})

export default function extendedProfiles(state = initialState, action) {
    switch(action.type) {
    case types.LOAD_EXTENDED_PROFILE:
        return state.set('loading', true);
    case types.LOAD_EXTENDED_PROFILE_SUCCESS:
        return state.withMutations(map => {
            map.updateIn(['objects'], map => map.set(action.payload.profile.id, action.payload))
                .set('loading', false);
        });
    case types.LOAD_EXTENDED_PROFILE_FAILURE:
        return state.set('loading', false);
    default:
        return state;
    }
}