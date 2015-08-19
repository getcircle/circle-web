import * as types from '../constants/actionTypes';
import {
    getLocation,
} from '../services/organization';
import { getProfiles } from '../services/profile';

export function loadLocation(locationId) {
    return {
        types: [
            types.LOAD_LOCATION,
            types.LOAD_LOCATION_SUCCESS,
            types.LOAD_LOCATION_FAILURE,
        ],
        fetch: () => getLocation(locationId),
        shouldFetch: state => !state.locations.getIn(['objects', locationId]),
    }
}

export function loadLocationMembers(locationId) {
    return {
        types: [
            types.LOAD_LOCATION_MEMBERS,
            types.LOAD_LOCATION_MEMBERS_SUCCESS,
            types.LOAD_LOCATION_MEMBERS_FAILURE,
        ],
        fetch: () => getProfiles({location_id: locationId}),
    }
}