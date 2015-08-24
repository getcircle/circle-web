import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import {
    getLocation,
} from '../services/organization';
import { getProfiles } from '../services/profile';

export function loadLocation(locationId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_LOCATION,
                types.LOAD_LOCATION_SUCCESS,
                types.LOAD_LOCATION_FAILURE,
            ],
            remote: () => getLocation(locationId),
            bailout: state => state.locations.getIn(['objects', locationId]),
        },
    };
}

export function loadLocationMembers(locationId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_LOCATION_MEMBERS,
                types.LOAD_LOCATION_MEMBERS_SUCCESS,
                types.LOAD_LOCATION_MEMBERS_FAILURE,
            ],
            /*eslint-disable camelcase */
            remote: () => getProfiles({location_id: locationId}),
            /*eslint-enable camelcase */
        },
    };
}
