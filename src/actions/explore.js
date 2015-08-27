import keymirror from 'keymirror';

import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';

import { getProfiles } from '../services/profile';
import {
    getLocations,
    getTeams,
} from '../services/organization';

const exploreActionTypes = [
    types.EXPLORE,
    types.EXPLORE_SUCCESS,
    types.EXPLORE_FAILURE,
];

export const EXPLORE_TYPES = keymirror({
    PROFILES: null,
    TEAMS: null,
    LOCATIONS: null,
});

export function exploreProfiles(nextRequest) {
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: () => getProfiles(null, nextRequest, EXPLORE_TYPES.PROFILES),
        },
        meta: {
            paginateBy: EXPLORE_TYPES.PROFILES,
        },
    }
}

export function exploreTeams(nextRequest) {
    // TODO add shouldFetch
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: () => {
                return getTeams(null, nextRequest)
                    .then((response) => {
                        return Promise.resolve({
                            results: response.teams,
                            nextRequest: response.nextRequest,
                        });
                    })
            },
        },
        payload: {
            type: EXPLORE_TYPES.TEAMS,
            append: nextRequest && true,
        },
    }
}

export function exploreLocations(nextRequest) {
    // TODO add shouldFetch
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: () => {
                return getLocations(null, nextRequest)
                    .then((response) => {
                        return Promise.resolve({
                            results: response.locations,
                            nextRequest: response.nextRequest,
                        });
                    });
            },
        },
        payload: {
            type: EXPLORE_TYPES.LOCATIONS,
            append: nextRequest && true,
        },
    }
}

export function clearExploreResults() {
    return {
        type: types.CLEAR_EXPLORE_RESULTS,
    }
}
