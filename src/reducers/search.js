import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    results: {},
    active: false,
});

export default function search(state = initialState, action) {
    switch(action.type) {
    case types.SEARCH_SUCCESS:
        return state.setIn(['results', action.payload.query], action.payload.results);
    case types.CLEAR_RESULTS:
        return state.update('results', map => map.clear());
    }
    return state;
}