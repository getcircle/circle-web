import * as organizationRequests from '../services/organization';
import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';

export function setManager(managerProfileId, profileId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_ORGANIZATION,
                types.UPDATE_ORGANIZATION_SUCCESS,
                types.UPDATE_ORGANIZATION_FAILURE,
            ],
            remote: () => organizationRequests.setManager(managerProfileId, profileId),
        },
    };
}
