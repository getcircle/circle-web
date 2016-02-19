import * as types from '../constants/actionTypes';
import { SERVICE_REQUEST } from '../middleware/services';

import { searchV2 } from '../services/search';

export function clearResults() {
    return {
        type: types.CLEAR_AUTOCOMPLETE_RESULTS,
    }
}

export function autocomplete(query) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.AUTOCOMPLETE,
                types.AUTOCOMPLETE_SUCCESS,
                types.AUTOCOMPLETE_FAILURE,
            ],
            remote: (client) => searchV2(client, query),
            bailout: (state) => state.get('search').getIn(['results', query]),
        },
        payload: {query},
    }
}
