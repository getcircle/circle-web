import * as types from '../constants/actionTypes';
import { SERVICE_REQUEST } from '../middleware/services';

import { search } from '../services/search';

export function loadSearchResults(query, category, attribute, attributeValue) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.SEARCH,
                types.SEARCH_SUCCESS,
                types.SEARCH_FAILURE,
            ],
            remote: () => search(query, category, attribute, attributeValue),
            bailout: (state) => state.search.getIn(['results', query]),
        },
        payload: { query, category, attribute, attributeValue},
    }
}

export function clearSearchResults() {
    return {
        type: types.CLEAR_SEARCH_RESULTS,
    }
}
