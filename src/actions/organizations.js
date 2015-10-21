import * as organizationRequests from '../services/organization';
import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';

export function setManager(managerProfileId, profileId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.SET_MANAGER,
                types.SET_MANAGER_SUCCESS,
                types.SET_MANAGER_FAILURE,
            ],
            remote: () => organizationRequests.setManager(managerProfileId, profileId),
        },
    };
}
