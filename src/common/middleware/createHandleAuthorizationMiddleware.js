import { services } from 'protobufs';

import { authenticate } from '../actions/authentication';
import { AUTH_BACKENDS } from '../services/user';

function handleOktaAuthorization(dispatch, query) {
    const samlDetails = services.user.containers.SAMLDetailsV1.decode64(query['saml_details']);
    return dispatch(authenticate(AUTH_BACKENDS.OKTA, undefined, samlDetails.auth_state));
}

function handleGoogleAuthorization(dispatch, query) {
    const oauthSdkDetails = services.user.containers.OAuthSDKDetailsV1.decode64(query['oauth_sdk_details']);
    return dispatch(authenticate(AUTH_BACKENDS.GOOGLE, oauthSdkDetails.code, oauthSdkDetails.id_token));
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
export default function (store) {
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
            handleOktaAuthorization(store.dispatch, query).then(() => {
                // XXX support the previous path they came to
                replaceState(null, '/');
                exit();
            });
        } else if (identity.provider === services.user.containers.IdentityV1.ProviderV1.GOOGLE) {
            return handleGoogleAuthorization(store.dispatch, query).then(() => {
                // XXX support the previous path they came to
                replaceState(null, '/');
                exit();
            });
        }
        next(nextState, replaceState, exit);
    }
}
