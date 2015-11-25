import * as organizationRequests from '../services/organization';
import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import { getProfiles } from '../services/profile';

export function loadLocation(locationId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_LOCATION,
                types.LOAD_LOCATION_SUCCESS,
                types.LOAD_LOCATION_FAILURE,
            ],
            remote: () => organizationRequests.getLocation(locationId),
            bailout: state => state.locations.get('ids').has(locationId),
        },
    };
}

export function loadLocationMembers(locationId, nextRequest=null) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_LOCATION_MEMBERS,
                types.LOAD_LOCATION_MEMBERS_SUCCESS,
                types.LOAD_LOCATION_MEMBERS_FAILURE,
            ],
            /*eslint-disable camelcase */
            remote: () => getProfiles({location_id: locationId}, nextRequest),
            /*eslint-enable camelcase */
            bailout: (state) => {
                if (state.locationMembers.has(locationId) && nextRequest === null) {
                    return state.locationMembers.get(locationId).get('ids').size > 0;
                }
            },
        },
        meta: {
            paginateBy: locationId,
        },
    };
}

export function updateLocation(location) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_LOCATION,
                types.UPDATE_LOCATION_SUCCESS,
                types.UPDATE_LOCATION_FAILURE,
            ],
            remote: () => organizationRequests.updateLocation(location),
        },
    };
}
