import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

// in seconds
const TIME_TO_LIVE = 60 * 5;

const initialState = Immutable.fromJS({
    entities: Immutable.Map(),
    normalizations: Immutable.Map(),
    timestamps: Immutable.Map(),
});

export function isEntityStale(cache, entityKey, key) {
    if (cache.timestamps && cache.timestamps[entityKey]) {
        let timestamp = cache.timestamps[entityKey][key];
        if (timestamp) {
            let currentTime = Math.floor(new Date().getTime() / 1000);
            let ageInSeconds = currentTime - timestamp;
            if (ageInSeconds > TIME_TO_LIVE) {
                return true;
            }
        }
    }
    return false;
}

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

            if (action.payload.entities) {
                for (let entitiesType in action.payload.entities) {
                    const entities = action.payload.entities[entitiesType];
                    for (let entityId in entities) {
                        // Timestamp when each entity in the payload gets
                        // cached so we can calculate its age later for TTL.
                        // Timestamps are in Epoch time, measured in seconds.
                        const epochTime = Math.floor(new Date().getTime() / 1000);
                        map.setIn(['timestamps', entitiesType, entityId], epochTime);

                        // Keep old values for fields excluded by new entities.
                        let newEntity = entities[entityId];
                        const oldEntity = map.getIn(['entities', entitiesType, entityId]);
                        if (oldEntity) {
                            let excludedFields = [];
                            if (newEntity.fields) {
                                if (newEntity.fields.exclude.length > 0) {
                                    excludedFields = excludedFields.concat(newEntity.fields.exclude);
                                } else if (newEntity.fields.only.length > 0) {
                                    const otherFields = oldEntity.$type._fields.map((field) => {
                                        if (newEntity.fields.only.indexOf(field.name) < 0) {
                                            return field.name;
                                        }
                                    });
                                    excludedFields = excludedFields.concat(otherFields);
                                }
                            }
                            if (newEntity.inflations) {
                                if (newEntity.inflations.exclude.length > 0) {
                                    excludedFields = excludedFields.concat(newEntity.inflations.exclude);
                                } else if (newEntity.inflations.only.length > 0) {
                                    const otherFields = oldEntity.$type._fields.map((field) => {
                                        if (newEntity.inflations.only.indexOf(field.name) < 0) {
                                            return field.name;
                                        }
                                    });
                                    excludedFields = excludedFields.concat(otherFields);
                                }
                            }
                            excludedFields.forEach((field) => {
                                newEntity.set(field, oldEntity.get(field));
                            });
                        }
                    }
                }
            }

            map.mergeDeepIn(['entities'], action.payload.entities)
                .mergeDeepIn(['normalizations'], action.payload.normalizations);
        });
    }
    return state;
}
