import * as types from '../constants/actionTypes';

import { search } from '../services/search';

export function loadSearchResults(query, category) {
    return {
        types: [
            types.SEARCH,
            types.SEARCH_SUCCESS,
            types.SEARCH_FAILURE,
        ],
        fetch: () => search(query, category),
        shouldFetch: (state) => !state.search.getIn(['results', query]),
        payload: {query, category},
    }
}

export function clearSearchResults() {
    return {
        type: types.CLEAR_SEARCH_RESULTS,
    }
}