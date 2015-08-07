import * as types from '../constants/actionTypes';
import { authenticateUser } from '../services/user';
import client from '../services/client';
import { getOrganization } from '../services/organization';
import { getProfileWithUserId } from '../services/profile';

export function authenticate(backend, key, secret) {
    return {
        types: [
            types.AUTHENTICATE,
            types.AUTHENTICATE_SUCCESS,
            types.AUTHENTICATE_FAILED,
        ],
        fetch: () => {
            let payload = {};
            return authenticateUser(backend, key, secret)
                .then((response) => {
                    const { user, token } = response;
                    payload.user = user;
                    payload.token = token;
                    client.authenticate(token);
                    return Promise.resolve(user);
                })
                .then((user) => getProfileWithUserId(user.id))
                .then((profile) => {
                    payload.profile = profile;
                    return getOrganization(profile.organization_id);
                })
                .then((organization) => {
                    payload.organization = organization;
                    return Promise.resolve(payload);
                })
        },
    }
}
