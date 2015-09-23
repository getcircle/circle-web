import { SERVICE_REQUEST } from '../middleware/services';
import * as types from '../constants/actionTypes';
import * as userService from '../services/user';
import client from '../services/client';
import { getOrganization } from '../services/organization';
import { getProfile } from '../services/profile';

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
                    .then(() => Promise.all([getProfile(), getOrganization()]))
                    .then(([profile, organization]) => {
                        payload.profile = profile;
                        payload.organization = organization;
                        return Promise.resolve(payload);
                    });
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
            remote: (state) => {
                let payload = {}
                return getProfile()
                    .then((profile) => {
                        payload.profile = profile;
                        return getOrganization(profile.organization_id);
                    })
                    .then((organization) => {
                        payload.organization = organization;
                        return Promise.resolve(payload);
                    });
            },
        }
    };
}

export function getAuthenticationInstructions(email) {
    return {
        [SERVICE_REQUEST]: {
            types: [
                types.GET_AUTHENTICATION_INSTRUCTIONS,
                types.GET_AUTHENTICATION_INSTRUCTIONS_SUCCESS,
                types.GET_AUTHENTICATION_INSTRUCTIONS_FAILURE,
            ],
            remote: (state) => userService.getAuthenticationInstructions(email),
        },
    };
}
