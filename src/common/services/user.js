import { services } from 'protobufs';

import logger from '../utils/logger';

export const AUTH_BACKENDS = services.user.actions.authenticate_user.RequestV1.AuthBackendV1;

function getRedirectUri(url) {
    return `${url.protocol}//${url.host}/auth`;
}

export function getNextPath(url) {
    const search = url.raw.split('?')[1];
    if (search) {
        for (let param of search.split('&')) {
            const [key, value] = param.split('=');
            if (key === 'next' && value && value.trim()) {
                return decodeURIComponent(value);
            }
        }
    }
}

export function authenticate(client, backend, key, secret, domain) {
    /*eslint-disable camelcase*/
    let parameters = {
        backend: backend,
        credentials: {key, secret},
        client_type: services.user.containers.token.ClientTypeV1.WEB,
        organization_domain: domain,
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

export function getAuthenticationInstructions(client, email, url) {
    const parameters = {
        email,
        /*eslint-disable camelcase*/
        organization_domain: url.subdomain,
        redirect_uri: getRedirectUri(url),
        next_path: getNextPath(url),
        /*eslint-enable camelcase*/
    };
    let request = new services.user.actions.get_authentication_instructions.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.isSuccess()) {
                    resolve({
                        authorizationUrl: response.result.authorization_url,
                        // NB: protobufjs doesn't handle proto3 default enum
                        // values well, this is returned as "null", even if
                        // explicitly set to 0
                        backend: response.result.backend || 0,
                        userExists: response.result.user_exists,
                        email: email,
                        organizationDomain: url.subdomain,
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

export function getIntegrationAuthenticationInstructions(client, integration, url) {
    const parameters = {
        /*eslint-disable camelcase*/
        organization_domain: url.subdomain,
        redirect_uri: getRedirectUri(url),
        provider: integration,
        /*eslint-enable camelcase*/
    };
    let request = new services.user.actions.get_integration_authentication_instructions.RequestV1(parameters);
    return new Promise((resolve, reject) => {
        client.sendRequest(request)
            .then((response) => {
                if (response.isSuccess()) {
                    resolve({
                        authorizationUrl: response.result.authorization_url,
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
