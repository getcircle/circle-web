import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { authenticate } from '../actions/authentication';
import { AUTH_BACKENDS } from '../services/user';
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
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }),
    }

    componentWillMount() {
        let { identity } = this.props.location.query;
        identity = services.user.containers.IdentityV1.decode64(identity);
        if (identity.provider === services.user.containers.IdentityV1.ProviderV1.SAML) {
            this.handleSamlAuthorization(this.props.location.query);
        } else if (identity.provider === services.user.containers.IdentityV1.ProviderV1.GOOGLE) {
            this.handleGoogleAuthorization(this.props.location.query);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.authenticated || nextProps.authError) {
            this.context.router.replaceWith('/');
            return false;
        }
        return true;
    }

    handleSamlAuthorization(query) {
        const samlDetails = services.user.containers.SAMLDetailsV1.decode64(query['saml_details']);
        this.props.dispatch(authenticate(AUTH_BACKENDS.SAML, undefined, samlDetails.auth_state));
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
