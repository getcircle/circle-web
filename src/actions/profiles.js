import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import {
    getProfiles,
    getExtendedProfile,
} from '../services/profile';

export function loadProfiles(parameters, nextRequest) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_PROFILES,
                types.LOAD_PROFILES_SUCCESS,
                types.LOAD_PROFILES_FAILURE,
            ],
            remote: () => getProfiles(parameters, nextRequest),
        },
    };
}

export function loadExtendedProfile(profileId) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_EXTENDED_PROFILE,
                types.LOAD_EXTENDED_PROFILE_SUCCESS,
                types.LOAD_EXTENDED_PROFILE_FAILURE,
            ],
            remote: () => getExtendedProfile(profileId),
            bailout: (state) => state.extendedProfiles.getIn(['objects', profileId]),
        },
    };
}
