import Immutable from 'immutable';

import * as actionTypes from '../constants/actionTypes';
import { getPaginator } from '../services/helpers';

// ttl interval in milliseconds
const TTL_INTERVAL = 300000

export default function paginate({
        types,
        mapActionToKey,
        mapActionToResults = action => action.payload.result,
        additionalTypesCallback,
    }) {
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected types to be an array of three elements');
    }

    if (!types.every(t => typeof t === 'string')) {
        throw new Error('Expected types to be strings');
    }

    if (typeof mapActionToKey !== 'function') {
        throw new Error('Expected mapActionToKey to be a function');
    }

    if (typeof mapActionToResults !== 'function') {
        throw new Error('Expected mapActionToResults to be a function');
    }

    const [requestType, successType, failureType] = types;

    function updatePagination(state = Immutable.fromJS({
        loading: false,
        nextRequest: null,
        ids: Immutable.OrderedSet(),
        ttl: null,
        pages: Immutable.OrderedSet(),
    }), action) {
        const { payload } = action;
        switch (action.type) {
        case requestType:
            return state.set('loading', true);
        case successType:
            return state.withMutations(map => {
                const results = mapActionToResults(action);
                return map.updateIn(['ids'], set => set.union(results))
                    .set('loading', false)
                    .set('ttl', Date.now() + TTL_INTERVAL)
                    .set('nextRequest', payload.nextRequest)
                    .updateIn(['pages'], (set) => {
                        if (!payload.nextRequest) return;

                        const paginator = getPaginator(payload.nextRequest);
                        if (paginator.previous_page !== null) {
                            return set.add(paginator.previous_page);
                        }
                    });
            });
        case failureType:
            return state.set('loading', false);
        default:
            return state;
        }
    }

    return function updatePaginationByKey(state = Immutable.Map(), action) {
        switch(action.type) {
        case requestType:
        case successType:
        case failureType:
            const key = mapActionToKey(action);
            return state.withMutations(map => {
                return map.mergeDeep({
                    [key]: updatePagination(map.get(key), action),
                });
            });
        case actionTypes.LOGOUT_SUCCESS:
            return Immutable.Map();
        default:
            if (additionalTypesCallback) {
                return additionalTypesCallback(state, action);
            }

            return state;
        }
    };

}
