import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    entities: Immutable.Map(),
    normalizations: Immutable.Map(),
    timestamps: Immutable.Map(),
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
                for (let normalizationsType in action.payload.normalizations) {
                    const normalizations = action.payload.normalizations[normalizationsType];
                    for (let normalizationId in normalizations) {
                        map.deleteIn(['normalizations', normalizationsType, normalizationId]);
                    }
                }
            }

            // Timestamp when each entity in the payload gets cached so we can calculate its age later for TTL.
            for (let entityType in action.payload.entities) {
                const entities = action.payload.entities[entityType];
                for (let entityId in entities) {
                    // Store timestamp as Epoch time measured in seconds.
                    const epochTime = Math.floor(new Date().getTime() / 1000);
                    map.setIn(['timestamps', entityType, entityId], epochTime);
                }
            }

            map.mergeDeepIn(['entities'], action.payload.entities)
                .mergeDeepIn(['normalizations'], action.payload.normalizations);
        });
    }
    return state;
}
