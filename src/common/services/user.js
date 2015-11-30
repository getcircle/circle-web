import {services} from 'protobufs';

import logger from '../utils/logger';

export const AUTH_BACKENDS = services.user.actions.authenticate_user.RequestV1.AuthBackendV1;

export function authenticate(client, backend, key, secret) {
    /*eslint-disable camelcase*/
    let parameters = {
        backend: backend,
        credentials: {key, secret},
        client_type: services.user.containers.token.ClientTypeV1.WEB,
    };
    /*eslint-enable camelcase*/

    let request = new services.user.actions.authenticate_user.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.isSuccess()) {
                    let { user } = response.result;
                    resolve({user});
                } else {
                    reject(response.reject());
                }
            })
            .catch((error) => {
                logger.log(`Error logging in: ${error}`);
                reject(error);
            });
    });
}

export function getAuthenticationInstructions(client, email, subdomain) {
    const parameters = {
        email,
        /*eslint-disable camelcase*/
        organization_domain: subdomain,
        redirect_uri: `${window.location.protocol}//${window.location.host}/auth`,
        /*eslint-enable camelcase*/
    };
    let request = new services.user.actions.get_authentication_instructions.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.isSuccess()) {
                    resolve({
                        authorizationUrl: response.result.authorization_url,
                        backend: response.result.backend,
                        userExists: response.result.user_exists,
                        email: email,
                        organizationDomain: subdomain,
                        providerName: response.result.provider_name,
                        organizationImageUrl: response.result.organization_image_url
                    });
                } else {
                    reject(response.reject());
                }
            })
            .catch((error) => {
                logger.log(`Error fetching instructions: ${error}`);
                reject(error);
            });
    });
}

export function logout(client) {
    /*eslint-disable camelcase*/
    let parameters = {client_type: services.user.containers.token.ClientTypeV1.WEB};
    /*elsint-enable camelcase*/
    let request = new services.user.actions.logout.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(() => resolve())
            .catch((error) => {
                logger.log(`Error logging out: ${error}`);
                reject(error);
            });
    });
}

export function requestAccess(client, domain, userInfo) {
    /*eslint-disable camelcase*/
    const parameters = {
        anonymous_user: {
            user_info: userInfo,
            location: window.location.origin,
            domain,
        },
    };
    /*eslint-enable camelcase*/
    let request = new services.user.actions.request_access.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then(() => resolve())
            .catch(error => reject(error));
    });
}
