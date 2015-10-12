import * as types from '../constants/actionTypes';
import * as userService from '../services/user';
import client from '../services/client';
import { getOrganization } from '../services/organization';
import { getProfile } from '../services/profile';
import { retrieveProfile } from '../reducers/denormalizations';
import { SERVICE_REQUEST } from '../middleware/services';

function getAuthenticatedObjectsPayload(payload = {}) {
    return new Promise((resolve, reject) => {
        Promise.all([getProfile(), getOrganization()])
            .then(([profileNormalizedResponse, organization]) => {
                payload = Object.assign({}, payload, profileNormalizedResponse);
                const profile = retrieveProfile(profileNormalizedResponse.result, profileNormalizedResponse);
                payload.profile = profile;
                payload.organization = organization;
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
                        const { user, token } = response;
                        payload.user = user;
                        payload.token = token;
                        client.authenticate(token);
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
