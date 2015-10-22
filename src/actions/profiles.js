import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/profile';
import * as organizationRequests from '../services/organization';

export function getProfiles(parameters, nextRequest) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_PROFILES,
                types.LOAD_PROFILES_SUCCESS,
                types.LOAD_PROFILES_FAILURE,
            ],
            remote: () => requests.getProfiles(parameters, nextRequest),
        },
    };
}

export function getExtendedProfile(profileId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_EXTENDED_PROFILE,
                types.LOAD_EXTENDED_PROFILE_SUCCESS,
                types.LOAD_EXTENDED_PROFILE_FAILURE,
            ],
            remote: () => requests.getExtendedProfile(profileId),
        },
    };
}

export function updateProfile(profile) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_PROFILE,
                types.UPDATE_PROFILE_SUCCESS,
                types.UPDATE_PROFILE_FAILURE,
            ],
            remote: () => requests.updateProfile(profile),
        },
    };
}

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
