import Immutable from 'immutable';

import * as actionTypes from '../constants/actionTypes';
import { getPaginator } from '../services/helpers';

// ttl interval in milliseconds
const TTL_INTERVAL = 300000

export function slice(state) {
    const pageSize = state.get('pageSize');
    const currentPage = state.get('currentPage');
    return state.get('ids').slice(0, pageSize * currentPage);
}


/**
 * Determine whether or not we should bail from a paginated reducer.
 *
 * @param {String} key key to look up in the state (paginated reducer name)
 * @param {String} paginateBy key we're paginating by
 * @param {Object} nextRequest the next request if any
 * @param {Object} state redux state
 * @returns {Object} returns an object with {bail: <should bail boolean>, paginator: <new paginator if applicable>}
 *
 */
export function paginatedShouldBail(key, paginateBy, nextRequest, state) {
    if (state.get(key).has(paginateBy)) {
        if (nextRequest === null) return {bail: true};
        const paginator = getPaginator(nextRequest);
        const bail = state.get(key).get(paginateBy).get('pages').has(paginator.page);
        return {bail, paginator}
    }
    return {bail: false};
}

/**
 * Rewind paginated data back to just the first page.
 *
 * This is useful for large infinite scroll lists, when we navigate away, we
 * only want to keep the first page in the cache or it will take forever to
 * render.
 *
 * @param {String} key key in the pagination state we're rewinding
 * @param {Object} state state returned by `updatePagination`
 * @returns {Object} new immutable state
 *
 */
export function rewind(key, state) {
    return mutateStateForKey(key, state, undefined, (keyState, action) => {
        const nextRequest = keyState.get('nextRequest');
        if (!nextRequest) {
            return keyState;
        }

        const paginator = getPaginator(nextRequest);
        paginator.page = 2;
        /*eslint-disable camelcase*/
        paginator.previous_page = 1;
        /*eslint-enable camelcase*/
        return keyState.withMutations(map => {
            return map.set('nextRequest', nextRequest)
                .set('currentPage', 1);
        });
    });
}

/**
 * Helper for mutating the paginated state for the given key.
 *
 * @param {String} key key within state
 * @param {Object} state paginated state tree
 * @param {Object} action redux action
 * @param {Function} callback callback, should accept (keyState, action) where
 *      keyState is the state for the given key in the paginated state and
 *      action is whatever action is being processed
 */
function mutateStateForKey(key, state, action, callback) {
    return state.withMutations(map => {
        return map.mergeDeep({
            [key]: callback(map.get(key), action),
        });
    });
}

export default function paginate({
        types,
        mapActionToKey,
        mapActionToResults = action => action.payload.result,
        additionalTypesCallback,
    }) {
    if (!Array.isArray(types) || !(types.length >= 3)) {
        throw new Error('Expected types to be an array of at least three elements');
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

    let bailType = 'Not Set';
    const [requestType, successType, failureType] = types;
    if (types.length > 3) {
        bailType = types[3];
    }

    function updatePagination(state = Immutable.fromJS({
        loading: false,
        nextRequest: null,
        ids: Immutable.OrderedSet(),
        ttl: null,
        pages: Immutable.OrderedSet(),
        currentPage: 1,
        pageSize: 15,
    }), action) {
        const { payload } = action;
        switch (action.type) {
        case requestType:
            return state.set('loading', true);
        case successType:
            return state.withMutations(map => {
                let paginator;
                if (payload.nextRequest) {
                    paginator = getPaginator(payload.nextRequest);
                }
                const results = mapActionToResults(action);
                return map.updateIn(['ids'], set => set.union(results))
                    .set('loading', false)
                    .set('ttl', Date.now() + TTL_INTERVAL)
                    .set('nextRequest', payload.nextRequest)
                    .updateIn(['pages'], (set) => {
                        if (!paginator) return;
                        if (paginator.previous_page !== null) {
                            return set.add(paginator.previous_page);
                        }
                    })
                    .set('currentPage', paginator ? paginator.previous_page : 1)
                    .set('pageSize', paginator ? paginator.page_size : state.get('pageSize'));
            });
        case failureType:
            return state.set('loading', false);
        case bailType:
            const nextRequest = state.get('nextRequest');
            if (nextRequest) {
                const paginator = getPaginator(nextRequest);
                /*eslint-disable camelcase*/
                paginator.previous_page = action.payload.paginator.page;
                /*eslint-enable camelcase*/
                paginator.page = action.payload.paginator.page + 1;
            }
            return state.withMutations(map => {
                return map.set('currentPage', action.payload.paginator.page)
                    .set('nextRequest', nextRequest);
            });
        default:
            return state;
        }
    }

    return function updatePaginationByKey(state = Immutable.Map(), action) {
        switch(action.type) {
        case requestType:
        case successType:
        case failureType:
        case bailType:
            const key = mapActionToKey(action);
            return mutateStateForKey(key, state, action, updatePagination);
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
