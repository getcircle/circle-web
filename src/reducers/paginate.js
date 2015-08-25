import Immutable from 'immutable';

// ttl interval in milliseconds
const TTL_INTERVAL = 300000

export default function paginate({
        types,
        mapActionToKey,
        mapActionToResults = action => action.payload.result,
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
                    .set('nextRequest', payload.nextRequest);
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
        default:
            return state;
        }
    };

}
