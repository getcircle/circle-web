import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';

import {
    authenticate,
    getAuthenticationInstructions,
    requestAccess,
} from '../actions/authentication';
import { AUTH_BACKENDS } from '../services/user';
import { fontColors, fontWeights } from '../constants/styles';
import * as selectors from '../selectors';
import { getSubdomain } from '../utils/subdomains';
import t from '../utils/gettext';

import CSSComponent from '../components/CSSComponent';
import LoginRequestAccess from '../components/LoginRequestAccess';
import LoginForm from '../components/LoginForm';

const {
    CircularProgress,
    Paper,
} = mui;

const selector = createSelector(
    [selectors.authenticationSelector],
    (authenticationState) => {
        return {
            authError: authenticationState.get('authError'),
            authenticated: authenticationState.get('authenticated'),
            authorizationUrl: authenticationState.get('authorizationUrl'),
            backend: authenticationState.get('backend'),
            userExists: authenticationState.get('userExists'),
            organizationDomain: authenticationState.get('organizationDomain'),
            organizationImageUrl: authenticationState.get('organizationImageUrl'),
            providerName: authenticationState.get('providerName'),
            email: authenticationState.get('email'),
        }
    },
)

@connect(selector)
class Login extends CSSComponent {

    static propTypes = {
        authError: PropTypes.object,
        authenticated: PropTypes.bool,
        authorizationUrl: PropTypes.string,
        backend: PropTypes.number,
        dispatch: PropTypes.func.isRequired,
        email: PropTypes.string,
        location: PropTypes.object.isRequired,
        organizationDomain: PropTypes.string,
        organizationImageUrl: PropTypes.string,
        providerName: PropTypes.string,
        subdomain: PropTypes.string,
        userExists: PropTypes.bool,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }),
    }

    static defaultProps = {
        subdomain: getSubdomain(),
    }

    componentWillMount() {
        if (this.props.subdomain && !this.isAccessRequest()) {
            this.props.dispatch(getAuthenticationInstructions(null, this.props.subdomain));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.backend && this.props.subdomain) {
            this.props.dispatch(getAuthenticationInstructions(null, this.props.subdomain));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.authenticated) {
            this.context.history.pushState(null, this.props.location.state.nextPathname || '/');
            return false;
        }
        return true;
    }

    hasImage() {
        if (
            this.props.organizationImageUrl !== null &&
            this.props.organizationImageUrl !== undefined &&
            this.props.organizationImageUrl !== ''
        ) {
            return true;
        }
        return false;
    }

    isAccessRequest() {
        if (this.props.location && this.props.location.query) {
            return this.props.location.query.accessRequest;
        }
        return false;
    }

    classes() {
        return {
            default: {
                container: {
                    backgroundColor: '#ffffff',
                    marginTop: '2%',
                    maxWidth: 600,
                    paddingTop: '5%',
                    paddingBottom: '5%',
                    width: '95%',
                },
                header: {
                    fontSize: 28,
                    paddingBottom: 20,
                    lineHeight: '35px',
                    ...fontColors.dark,
                    ...fontWeights.semiBold,
                },
                form: {
                    paddingBottom: 10,
                    maxWidth: 400,
                },
                organizationImage: {
                    maxHeight: 200,
                    maxWidth: '100%',
                    objectFit: 'contain',
                },
                section: {
                    marginLeft: 20,
                    marginRight: 20,
                },
                subHeader: {
                    fontSize: 26,
                    paddingBottom: 70,
                    ...fontColors.dark,
                },
                wrap: {
                    marginBottom: 0,
                    paddingTop: '2%',
                },
            },
        };
    }

    getHeaderText() {
        const isAccessRequest = this.isAccessRequest();
        if (this.props.subdomain && !isAccessRequest) {
            return t(`Sign in to ${window.location.host}`);
        } else if (isAccessRequest) {
            return t('Security is a little tight around here');
        } else {
            return t('Sign in');
        }
    }

    getAuthenticationInstructions(props) {
        // We only want to return authentication instructions if we've loaded instructions based on the subdomain and it
        // is configured for SSO or we've asked the user for their email address and have accurate authentication
        // instructions
        if (
            this.props.organizationDomain &&
            !this.props.email &&
            this.props.backend === AUTH_BACKENDS.INTERNAL
        ) {
            return {};
        } else {
            return {
                authorizationUrl: this.props.authorizationUrl,
                backend: this.props.backend,
            };
        }
    }

    renderOrganizationImage() {
        const { organizationImageUrl } = this.props;
        if (organizationImageUrl) {
            return (
                <div className="row center-xs">
                    <img is="organizationImage" src={organizationImageUrl} />
                </div>
            );
        } else {
            return <div style={{height: this.styles().organizationImage.maxHeight}} />;
        }
    }

    renderLoginForm() {
        const isAccessRequest = this.isAccessRequest();
        if (this.props.subdomain && !isAccessRequest && !this.props.email && !this.props.organizationDomain) {
            return (
                <div className="row center-xs">
                    <CircularProgress mode="indeterminate" size={0.5} />
                </div>
            );
        } else if (isAccessRequest) {
            const { userInfo } = this.props.location.query;
            return (
                <LoginRequestAccess
                    onRequestAccess={() => {
                        const user = atob(userInfo);
                        return this.props.dispatch(requestAccess(this.props.subdomain, user));
                    }}
                />
            );
        } else {
            const { dispatch } = this.props;
            const instructions = this.getAuthenticationInstructions(this.props);
            return (
                <LoginForm
                    authError={this.props.authError}
                    authenticate={(...args) => dispatch(authenticate(...args))}
                    authorizationUrl={instructions.authorizationUrl}
                    backend={instructions.backend}
                    email={this.props.email}
                    getAuthenticationInstructions={(email) => {
                        return dispatch(getAuthenticationInstructions(email));
                    }}
                    providerName={this.props.providerName}
                    userExists={this.props.userExists}
                />
            );
        }
    }

    render() {
        return (
            <div is="root">
                <div className="wrap" is="wrap">
                    {this.renderOrganizationImage()}
                    <div className="row center-xs">
                        <Paper is="container">
                            <div className="row center-xs">
                                <h1 is="header">{this.getHeaderText()}</h1>
                            </div>
                            <div className="row center-xs">
                                <div className="col-xs-12" is="form">
                                    {this.renderLoginForm()}
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
