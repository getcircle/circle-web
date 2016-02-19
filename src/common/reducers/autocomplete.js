import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    results: {},
    loading: false,
});

export default function autocomplete(state = initialState, action) {
    switch(action.type) {
        case types.LOGOUT_SUCCESS:
            return initialState;
        case types.AUTOCOMPLETE:
            return state.set('loading', true);
        case types.AUTOCOMPLETE_SUCCESS:
            return state.withMutations(map => {
                map.setIn(['results', action.payload.query], action.payload.results)
                .set('loading', false);
            });
        case types.AUTOCOMPLETE_FAILURE:
            return state.set('loading', false);
        case types.CLEAR_AUTOCOMPLETE_RESULTS:
            return state.withMutations(map => {
                map.update('results', map => map.clear())
                .set('loading', false);
            });
    }
    return state;
}
