import * as types from '../constants/actionTypes';
import { SERVICE_REQUEST } from '../middleware/services';

import * as notificationService from '../services/notification';
import * as requests from '../services/search';

function loadSearchResultsV1(query, category, attribute, attributeValue) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.SEARCH,
                types.SEARCH_SUCCESS,
                types.SEARCH_FAILURE,
            ],
            remote: (client) => requests.search(client, query, category, attribute, attributeValue),
            bailout: (state) => state.get('search').getIn(['results', query]),
        },
        payload: { query, category, attribute, attributeValue},
    }
}

function loadSearchResultsV2(query, category) {
    const action = loadSearchResultsV1(query, category);
    action[SERVICE_REQUEST].remote = (client) =>  requests.searchV2(client, query, category);
    return action;
}

export function loadSearchResults(query, category, attribute, attributeValue) {
    if (attribute === undefined || attribute === null) {
        // the search_v2 endpoint doesn't support attirbute and attribute value searches yet
        return loadSearchResultsV2(query, category);
    } else {
        return loadSearchResultsV1(query, category, attribute, attributeValue);
    }
}

export function search(query, category) {
    return loadSearchResultsV2(query, category);
}

export function clearResults() {
    return clearSearchResults();
}

export function clearSearchResults() {
    return {
        type: types.CLEAR_SEARCH_RESULTS,
    }
}

export function viewSearchResult(result) {
    return {
        type: types.VIEW_SEARCH_RESULT,
        payload: result,
    };
}

export function noSearchResults(query, comment) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.NO_SEARCH_RESULTS,
                types.NO_SEARCH_RESULTS_SUCCESS,
                types.NO_SEARCH_RESULTS_FAILURE,
            ],
            remote: (client) => notificationService.noSearchResults(client, query, comment),
        }
    }
}
