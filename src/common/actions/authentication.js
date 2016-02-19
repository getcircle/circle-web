import * as types from '../constants/actionTypes';
import * as userService from '../services/user';
import { getFlags } from '../services/feature';
import { getOrganization } from '../services/organization';
import { getExtendedProfile } from '../services/profile';
import { retrieveExtendedProfile } from '../reducers/denormalizations';
import { SERVICE_REQUEST } from '../middleware/services';

function getAuthenticatedObjectsPayload(client, payload = {}) {
    return new Promise((resolve, reject) => {
        Promise.all([getExtendedProfile(client), getOrganization(client), getFlags(client)])
            .then(([extendedProfileResponse, organization, flags]) => {
                payload = Object.assign({}, payload, extendedProfileResponse);
                const extendedProfile = retrieveExtendedProfile(extendedProfileResponse.result, extendedProfileResponse);
                payload.profile = extendedProfile.profile;
                payload.organization = organization;
                payload.profileLocation = extendedProfile.locations && extendedProfile.locations.length > 0 ? extendedProfile.locations[0] : null;
                payload.flags = flags;
                resolve(payload);
            })
            .catch(error => reject(error));
    });
}

export function authenticate(backend, key, secret, domain) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.AUTHENTICATE,
                types.AUTHENTICATE_SUCCESS,
                types.AUTHENTICATE_FAILURE,
            ],
            remote: (client) => {
                let payload = {};
                return userService.authenticate(client, backend, key, secret, domain)
                    .then((response) => {
                        const { user } = response;
                        payload.user = user;
                        return Promise.resolve(user);
                    })
                    .then(() => getAuthenticatedObjectsPayload(client, payload));
            },
        }
    };
}

export function logout() {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOGOUT,
                types.LOGOUT_SUCCESS,
                types.LOGOUT_FAILURE,
            ],
            remote: (client) => userService.logout(client),
        },
    };
}

export function loadAuth() {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.LOAD_AUTH,
                types.LOAD_AUTH_SUCCESS,
                types.LOAD_AUTH_FAILURE,
            ],
            remote: (client) => getAuthenticatedObjectsPayload(client),
        }
    };
}

export function getAuthenticationInstructions(email, url) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_AUTHENTICATION_INSTRUCTIONS,
                types.GET_AUTHENTICATION_INSTRUCTIONS_SUCCESS,
                types.GET_AUTHENTICATION_INSTRUCTIONS_FAILURE,
            ],
            remote: (client) => userService.getAuthenticationInstructions(client, email, url),
        },
    };
}

export function requestAccess(domain, userInfo) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.REQUEST_ACCESS,
                types.REQUEST_ACCESS_SUCCESS,
                types.REQUEST_ACCESS_FAILURE,
            ],
            remote: (client) => userService.requestAccess(client, domain, userInfo),
        },
    };
}
