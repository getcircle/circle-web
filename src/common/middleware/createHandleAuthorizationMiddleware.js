import { services } from 'protobufs';

import { authenticate } from '../actions/authentication';
import raven from '../utils/raven';
import { AUTH_BACKENDS } from '../services/user';

function handleOktaAuthorization(dispatch, query, url) {
    const credentials = services.user.containers.SAMLCredentialsV1.decode64(query['saml_credentials']);
    return dispatch(authenticate(AUTH_BACKENDS.OKTA, undefined, credentials.state, url.subdomain));
}

function handleGoogleAuthorization(dispatch, query, url) {
    const credentials = services.user.containers.GoogleCredentialsV1.decode64(query['google_credentials']);
    return dispatch(authenticate(AUTH_BACKENDS.GOOGLE, credentials.code, credentials.id_token, url.subdomain));
}

/**
 * React Router middleware for our /auth route.
 *
 * Our /auth route receives redirects from SSO providers, verifies the response
 * from our server, redirects the user to the authenticated portion of our
 * site, or drops them back on /login. Because of the redirects and how server
 * side rendering works, we need to trigger the redirects before rendering the
 * component.
 *
 * @param {Object} store - redux store, available in getRoutes.
 * @returns {function} middleware function that can be passed to `applyMiddleware` within `../common/getRoutes.js`
 */
export default function (store, url) {
    return next => (nextState, replaceState, exit) => {
        const { query } = nextState.location;
        const { error } = query;
        if (error) {
            const userInfo = query.user_info;
            let params = {};
            if (error === 'PROFILE_NOT_FOUND') {
                params = {accessRequest: true, userInfo};
            }
            replaceState(null, '/login', params);
            return exit();
        }

        let { identity } = query;
        identity = services.user.containers.IdentityV1.decode64(identity);
        if (identity.provider === services.user.containers.IdentityV1.ProviderV1.OKTA) {
            return handleOktaAuthorization(store.dispatch, query, url).then(() => {
                // XXX support the previous path they came to
                replaceState(null, '/');
                exit();
            });
        } else if (identity.provider === services.user.containers.IdentityV1.ProviderV1.GOOGLE) {
            return handleGoogleAuthorization(store.dispatch, query, url).then(() => {
                // XXX support the previous path they came to
                replaceState(null, '/');
                exit();
            });
        }
        raven.captureMessage('Unsupported identity.provider', {extra: {provider: identity.provider}});
        next(nextState, replaceState, exit);
    }
}
