import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    results: {},
    loading: false,
});

export default function search(state = initialState, action) {
    switch(action.type) {
    case types.SEARCH:
        return state.set('loading', false);
    case types.SEARCH_SUCCESS:
        return state.withMutations(map => {
            map.setIn(['results', action.payload.query], action.payload.results)
                .set('loading', false);
        });
    case types.SEARCH_FAILURE:
        return state.set('loading', false);
    case types.CLEAR_SEARCH_RESULTS:
        return state.withMutations(map => {
            map.update('results', map => map.clear())
            .set('loading', false);
        });
    }
    return state;
}
