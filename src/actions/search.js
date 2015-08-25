import * as types from '../constants/actionTypes';
import { SERVICE_REQUEST } from '../middleware/services';

import { search } from '../services/search';

export function loadSearchResults(query, category) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.SEARCH,
                types.SEARCH_SUCCESS,
                types.SEARCH_FAILURE,
            ],
            remote: () => search(query, category),
            bailout: (state) => state.search.getIn(['results', query]),
        },
        payload: { query, category },
    }
}

export function clearSearchResults() {
    return {
        type: types.CLEAR_SEARCH_RESULTS,
    }
}
