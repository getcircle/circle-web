import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/profile';

export function getProfiles(parameters, nextRequest) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_PROFILES,
                types.LOAD_PROFILES_SUCCESS,
                types.LOAD_PROFILES_FAILURE,
            ],
            remote: (client) => requests.getProfiles(client, parameters, nextRequest),
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
            remote: (client) => requests.getExtendedProfile(client, profileId),
        },
    };
}

export function updateProfile(profile, manager) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.UPDATE_PROFILE,
                types.UPDATE_PROFILE_SUCCESS,
                types.UPDATE_PROFILE_FAILURE,
            ],
            remote: (client) => requests.updateProfile(client, profile, manager),
        },
    };
}

/**
 * Show the update profile modal
 *
 * @return {Object} plain object redux action
 */
export function showModal() {
    return {type: types.MODAL_UPDATE_PROFILE_SHOW};
}

/**
 * Hide the update profile modal
 *
 * @return {Object} plain object redux action
 */
export function hideModal() {
    return {type: types.MODAL_UPDATE_PROFILE_HIDE};
}
