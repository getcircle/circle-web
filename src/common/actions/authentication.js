import * as types from '../constants/actionTypes';
import * as userService from '../services/user';
import client from '../services/client';
import { getFlags } from '../services/feature';
import { getOrganization } from '../services/organization';
import { getExtendedProfile } from '../services/profile';
import { retrieveExtendedProfile } from '../reducers/denormalizations';
import { SERVICE_REQUEST } from '../middleware/services';

function getAuthenticatedObjectsPayload(payload = {}) {
    return new Promise((resolve, reject) => {
        Promise.all([getExtendedProfile(), getOrganization(), getFlags()])
            .then(([extendedProfileResponse, organization, flags]) => {
                payload = Object.assign({}, payload, extendedProfileResponse);
                const extendedProfile = retrieveExtendedProfile(extendedProfileResponse.result, extendedProfileResponse);
                payload.profile = extendedProfile.profile;
                payload.organization = organization;
                payload.team = extendedProfile.team;
                payload.profileLocation = extendedProfile.locations && extendedProfile.locations.length > 0 ? extendedProfile.locations[0] : null;
                payload.managesTeam = extendedProfile.manages_team;
                payload.flags = flags;
                resolve(payload);
            })
            .catch(error => reject(error));
    });
}

export function authenticate(backend, key, secret) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.AUTHENTICATE,
                types.AUTHENTICATE_SUCCESS,
                types.AUTHENTICATE_FAILURE,
            ],
            remote: () => {
                let payload = {};
                return userService.authenticate(backend, key, secret)
                    .then((response) => {
                        const { user } = response;
                        payload.user = user;
                        return Promise.resolve(user);
                    })
                    .then(() => getAuthenticatedObjectsPayload(payload));
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
            remote: () => userService.logout(),
        },
    };
}

export function refresh() {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.REFRESH,
                types.REFRESH_SUCCESS,
                types.REFRESH_FAILURE,
            ],
            remote: state => getAuthenticatedObjectsPayload(),
        }
    };
}

export function getAuthenticationInstructions(email, subdomain) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_AUTHENTICATION_INSTRUCTIONS,
                types.GET_AUTHENTICATION_INSTRUCTIONS_SUCCESS,
                types.GET_AUTHENTICATION_INSTRUCTIONS_FAILURE,
            ],
            remote: (state) => userService.getAuthenticationInstructions(email, subdomain),
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
            remote: (state) => userService.requestAccess(domain, userInfo),
        },
    };
}
