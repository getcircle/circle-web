import { denormalize } from 'protobuf-normalizr';
import { services } from 'protobufs';

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
            remote: () => getExtendedProfile(profileId),
            bailout: (state) => state.extendedProfiles.getIn(['ids', profileId]),
        },
    };
}

export function retrieveExtendedProfile(profileId, cache) {
    return denormalize(profileId, services.profile.actions.get_extended_profile.ResponseV1, cache);
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
