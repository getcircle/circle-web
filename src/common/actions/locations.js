import * as organizationRequests from '../services/organization';
import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import { getProfiles } from '../services/profile';
import { retrieveLocation, retrieveProfiles } from '../reducers/denormalizations';

export function loadLocation(locationId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_LOCATION,
                types.LOAD_LOCATION_SUCCESS,
                types.LOAD_LOCATION_FAILURE,
            ],
            remote: (client) => organizationRequests.getLocation(client, locationId),
            bailout: (state) => {
                if (state.get('locations').get('ids').has(locationId)) {
                    const location = retrieveLocation(locationId, state.get('cache').toJS());
                    return location !== null;
                }
            },
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
            remote: (client) => getProfiles(client, {location_id: locationId}, nextRequest),
            /*eslint-enable camelcase */
            bailout: (state) => {
                if (state.get('locationMembers').has(locationId) && nextRequest === null) {
                    const ids = state.get('locationMembers').get(locationId).get('ids').toJS();
                    const members = retrieveProfiles(ids, state.get('cache').toJS());
                    return members !== null;
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
            remote: (client) => organizationRequests.updateLocation(client, location),
        },
    };
}
