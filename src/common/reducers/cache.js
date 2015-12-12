import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    entities: Immutable.Map(),
    normalizations: Immutable.Map(),
});

export default function cache(state = initialState, action) {
    switch(action.type) {
    case types.LOGOUT_SUCCESS:
        return initialState;
    }

    if (action.payload && action.payload.entities) {
        return state.withMutations(map => {
            // For normalizations we already have, we want to replace them instead of merging them.
            // The old normalizations may contain fields that don't exist in the new normalizations
            // and these will remain if merged.
            if (action.payload.normalizations) {
                for (var normalizationsType in action.payload.normalizations) {
                    const normalizations = action.payload.normalizations[normalizationsType];
                    for (var normalizationId in normalizations) {
                        map.deleteIn(['normalizations', normalizationsType, normalizationId]);
                    }
                }
            }

            map.mergeDeepIn(['entities'], action.payload.entities)
                .mergeDeepIn(['normalizations'], action.payload.normalizations);
        });
    }
    return state;
}
