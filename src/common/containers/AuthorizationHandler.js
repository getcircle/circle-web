import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { authenticate } from '../actions/authentication';
import { AUTH_BACKENDS } from '../services/user';
import { getNextPathname } from '../utils/routes';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import CSSComponent from '../components/CSSComponent';

const selector = createSelector(
    [selectors.authenticationSelector],
    (authenticationState) => {
        return {
            authError: authenticationState.get('authError'),
            authenticated: authenticationState.get('authenticated'),
        }
    },
)

@connect(selector)
class AuthorizationHandler extends CSSComponent {

    static propTypes = {
        authenticated: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.shape({
            query: PropTypes.object,
        }),
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        history: PropTypes.shape({
            replaceState: PropTypes.func.isRequired,
        }),
    }

    componentWillMount() {
        const { error } = this.props.location.query;
        if (error) {
            return this.handleError(this.props.location.query)
        }

        let { identity } = this.props.location.query;
        identity = services.user.containers.IdentityV1.decode64(identity);
        if (identity.provider === services.user.containers.IdentityV1.ProviderV1.OKTA) {
            this.handleOktaAuthorization(this.props.location.query);
        } else if (identity.provider === services.user.containers.IdentityV1.ProviderV1.GOOGLE) {
            this.handleGoogleAuthorization(this.props.location.query);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.authenticated || nextProps.authError) {
            const nextPathname = getNextPathname(null, '/');
            this.context.history.replaceState(null, nextPathname);
            return false;
        }
        return true;
    }

    handleError(query) {
        const { error } = query;
        const userInfo = query.user_info;
        let params = {};
        if (error === 'PROFILE_NOT_FOUND') {
            params = {accessRequest: true, userInfo};
        }
        this.context.history.replaceState(null, '/login', params);
    }

    handleOktaAuthorization(query) {
        const samlDetails = services.user.containers.SAMLDetailsV1.decode64(query['saml_details']);
        this.props.dispatch(authenticate(AUTH_BACKENDS.OKTA, undefined, samlDetails.auth_state));
    }

    handleGoogleAuthorization(query) {
        const oauthSdkDetails = services.user.containers.OAuthSDKDetailsV1.decode64(query['oauth_sdk_details']);
        this.props.dispatch(authenticate(AUTH_BACKENDS.GOOGLE, oauthSdkDetails.code, oauthSdkDetails.id_token));
    }

    render() {
        return <CenterLoadingIndicator />;
    }

}

export default AuthorizationHandler;
