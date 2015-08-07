import * as types from '../constants/actionTypes';
import { 
    getProfiles,
    getExtendedProfile,
} from '../services/profile';

export function loadProfiles(parameters, nextRequest) {
    return {
        types: [
            types.LOAD_PROFILES,
            types.LOAD_PROFILES_SUCCESS,
            types.LOAD_PROFILES_FAILURE,
        ],
        fetch: () => getProfiles(parameters, nextRequest),
    } 
}

export function loadExtendedProfile(profileId) {
    return {
        types: [
            types.LOAD_EXTENDED_PROFILE,
            types.LOAD_EXTENDED_PROFILE_SUCCESS,
            types.LOAD_EXTENDED_PROFILE_FAILURE,
        ],
        fetch: () => getExtendedProfile(profileId),
        shouldFetch: (state) => !state.extendedProfiles.getIn(['objects', profileId]),
    }
}