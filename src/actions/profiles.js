import * as types from '../constants/actionTypes';
import { getProfiles } from '../services/profile';

export function loadProfiles(parameters, nextRequest) {
    return {
        types: [
            types.LOAD_PROFILES,
            types.LOAD_PROFILES_SUCCESS,
            types.LOAD_PROFILES_FAILED,
        ],
        fetch: () => getProfiles(parameters, nextRequest),
    } 
}