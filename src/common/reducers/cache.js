import Immutable from 'immutable';

import * as types from '../constants/actionTypes';

const INFLATION_OPTION = '(services.common.containers.inflation)';

// in seconds
const TIME_TO_LIVE = 60 * 60 * 24;

const initialState = Immutable.fromJS({
    entities: Immutable.Map(),
    normalizations: Immutable.Map(),
    timestamps: Immutable.Map(),
});

/**
 * Return any field names of inflations that aren't within inflations.
 *
 * @param {Object} entity the protobuf entity
 * @param {Array[str]} inflations array of inflation names we're checking against.
 * @return {Array[str]} array of inflation names within `entity` that aren't within `inflations`
 */
function getExcludedInflations(entity, inflations) {
    if (!entity) {
        return [];
    }
    let otherInflations = entity.$type._fields.map((field) => {
        if (field.options[INFLATION_OPTION] && inflations.indexOf(field.name) < 0) {
            return field.name;
        }
    });
    return otherInflations.filter((elem) => elem !== undefined && elem !== null);
}

/**
 * Return any field names within entity that aren't within fields.
 *
 * @param {Object} entity the protobuf entity
 * @param {Array[str]} fields array of field names we're checking against.
 * @return {Array[str]} array of field names within `entity` that aren't within `fields`
 */
function difference(entity, fields) {
    if (!entity) {
        return [];
    }

    let otherFields = entity.$type._fields.map((field) => {
        if (!field.options[INFLATION_OPTION] && fields.indexOf(field.name) < 0) {
            return field.name;
        }
    });
    return otherFields.filter((elem) => elem !== undefined && elem !== null);
};

/**
 * Return fields that have been excluded from the new entity.
 * Any field that is excluded from the new entity will be pulled from the
 * oldEntity.
 *
 * @param {Object} newEntity the new entity we're loading into the cache
 * @param {Object} oldEntity the existing entity in the cache
 */
function getExcludedFields(newEntity, oldEntity) {
    let excludedFields = [];
    if (newEntity.fields) {
        if (newEntity.fields.exclude.length > 0) {
            excludedFields = excludedFields.concat(newEntity.fields.exclude);
        } else if (newEntity.fields.only.length > 0) {
            const otherFields = difference(oldEntity, newEntity.fields.only);
            excludedFields = excludedFields.concat(otherFields);
        }
    }
    if (newEntity.inflations) {
        if (newEntity.inflations.exclude.length > 0) {
            excludedFields = excludedFields.concat(newEntity.inflations.exclude);
        } else if (newEntity.inflations.only.length > 0) {
            const inflations = getExcludedInflations(oldEntity, newEntity.inflations.only);
            excludedFields = excludedFields.concat(inflations);
        }
    }
    return excludedFields;
}

/**
 * Merge a new entity with the existing entity in the cache.
 * The only case where it is necessary to merge entities is when the new entity
 * was only fetched with specific fields or inflations. In that case, those
 * fields from the existing entity should still be considered valid.
 *
 * @param {Object} newEntity the new entity we're loading into the cache
 * @param {Object} oldEntity the existing entity in the cache
 */
export function mergeEntities(newEntity, oldEntity) {
    const excludedFields = getExcludedFields(newEntity, oldEntity);
    excludedFields.forEach((field) => {
        newEntity.set(field, oldEntity.get(field));
    });
    return newEntity;
}

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
                        const newEntity = action.payload.entities[normalizationsType][normalizationId];
                        const oldEntity = map.getIn(['entities', normalizationsType, normalizationId]);
                        const excludedFields = getExcludedFields(newEntity, oldEntity);
                        const typeNormalizations = map.getIn(['normalizations', normalizationsType, normalizationId]);
                        if (typeNormalizations) {
                            for (let key of typeNormalizations.keys()) {
                                if (!excludedFields.includes(key)) {
                                    map.deleteIn(['normalizations', normalizationsType, normalizationId, key]);
                                }
                            }
                        }
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
                            newEntity = mergeEntities(newEntity, oldEntity);
                        }

                        // Remove any old normalizations
                        if (
                            action.payload.normalizations &&
                            (
                                !action.payload.normalizations[entitiesType] ||
                                !action.payload.normalizations[entitiesType][entityId]
                            )
                        ) {
                            if (!(newEntity.inflations && newEntity.inflations.disabled)) {
                                map.deleteIn(['normalizations', entitiesType, entityId]);
                            }
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
