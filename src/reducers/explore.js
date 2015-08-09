import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    results: [],
    nextRequest: null,
    type: null,
});

const handleExploreSuccess = (state, action) => {
    const { payload } = action;
    if (payload.type === state.get("type")) {
        return state.withMutations(map => {
            map.updateIn(['results'], list => list.concat(payload.results))
                .set('nextRequest', payload.nextRequest);
        });
    }
    return state.withMutations(map => {
        map.set('results', Immutable.fromJS(payload.results))
            .set('nextRequest', payload.nextRequest)
            .set('type', payload.type);
    });
}

export default function explore(state = initialState, action) {
    switch(action.type) {
    case types.EXPLORE_SUCCESS:
        return handleExploreSuccess(state, action);
    case types.CLEAR_EXPLORE_RESULTS:
        return state.set('results', Immutable.List());
    default:
        return state;
    }
}