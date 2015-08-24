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

export const exploreTypes = {
    PROFILES: 'PROFILES',
    TEAMS: 'TEAMS',
    LOCATIONS: 'LOCATIONS',
}

export function exploreProfiles(nextRequest) {
    // TODO add shouldFetch
    return {
        [SERVICE_REQUEST]: {
            types: exploreActionTypes,
            remote: () => {
                return getProfiles(null, nextRequest)
                    .then((response) => {
                        return Promise.resolve({
                            results: response.profiles,
                            nextRequest: response.nextRequest,
                        });
                    });
            },
        },
        payload: {
            type: exploreTypes.PROFILES,
            append: nextRequest && true,
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
            type: exploreTypes.TEAMS,
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
            type: exploreTypes.LOCATIONS,
            append: nextRequest && true,
        },
    }
}

export function clearExploreResults() {
    return {
        type: types.CLEAR_EXPLORE_RESULTS,
    }
}
