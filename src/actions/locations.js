import * as types from '../constants/actionTypes';
import {
    getLocation,
} from '../services/organization';

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