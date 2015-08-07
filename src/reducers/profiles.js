import _ from 'lodash';
import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    filter: [],
    nextRequest: null,
    loading: false,
});

const handleLoadProfilesSuccess = (state, action) => {
    const { profiles, nextRequest } = action.payload;
    return state.withMutations(map => {
        map.updateIn(['filter'], list => list.concat(profiles))
            .set('nextRequest', nextRequest)
            .set('loading', false);
    })
}

export default function profiles(state = initialState, action) {
    switch(action.type) {
    case types.LOAD_PROFILES:
        return state.set('loading', true);

    case types.LOAD_PROFILES_SUCCESS:
        return handleLoadProfilesSuccess(state, action);

    case types.LOAD_PROFILES_FAILURE:
        return state.set('loading', false);

    defaut:
        return state;
    }
    return state;
}