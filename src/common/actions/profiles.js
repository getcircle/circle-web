import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as requests from '../services/profile';
import { retrieveProfile } from '../reducers/denormalizations';

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
 * Get a profile
 *
 * @param {String} profileId id of the profile
 * @returns {Object} redux action
 */
export function getProfile(profileId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_PROFILE,
                types.GET_PROFILE_SUCCESS,
                types.GET_PROFILE_FAILURE,
            ],
            /*eslint-disable camelcase */
            remote: (client) => requests.getProfile(client, {profile_id: profileId}),
            /*eslint-enable camelcase */
            bailout: (state) => {
                const profile = retrieveProfile(profileId, state.get('cache').toJS());
                return profile !== null && profile !== undefined;
            },
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
