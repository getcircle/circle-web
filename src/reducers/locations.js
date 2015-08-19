import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    loading: false,
    objects: {},
});

export default function locations(state=initialState, action) {
    switch(action.type) {
    case types.LOAD_LOCATION:
        return state.set('loading', true);
    case types.LOAD_LOCATION_SUCCESS:
        return state.withMutations(map => {
            map.updateIn(['objects'], map => map.set(action.payload.id, action.payload))
                .set('loading', false);
        })
    case types.LOAD_LOCATION_FAILURE:
        return state.set('loading', false);
    default:
        return state;
    }
}
