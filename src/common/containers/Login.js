import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { provideHooks } from 'redial';

import { authenticate, getAuthenticationInstructions, requestAccess, } from '../actions/authentication';
import { AUTH_BACKENDS } from '../services/user';
import { fontColors, fontWeights } from '../constants/styles';
import * as selectors from '../selectors';
import { getNextPathname } from '../utils/routes';
import t from '../utils/gettext';

import CSSComponent from '../components/CSSComponent';
import InternalPropTypes from '../components/InternalPropTypes';
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

function isAccessRequest(location) {
    if (location && location.query) {
        return location.query.accessRequest;
    }
    return false;
}

const hooks = {
    fetch: ({ getState, dispatch, location, params, url }) => {
        const props = selector(getState());
        return fetchAuthenticationInstructions(dispatch, location, url, props);
    },
};

function fetchAuthenticationInstructions(dispatch, location, url, props) {
    if ((props.backend === undefined || props.backend === null) && !isAccessRequest(location)) {
        return dispatch(getAuthenticationInstructions(null, url));
    }
}

@provideHooks(hooks)
@connect(selector)
class Login extends CSSComponent {

    static propTypes = {
        authError: PropTypes.bool,
        authenticated: PropTypes.bool,
        authorizationUrl: PropTypes.string,
        backend: PropTypes.number,
        dispatch: PropTypes.func.isRequired,
        email: PropTypes.string,
        location: PropTypes.object.isRequired,
        organizationDomain: PropTypes.string,
        organizationImageUrl: PropTypes.string,
        providerName: PropTypes.string,
        userExists: PropTypes.bool,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        url: InternalPropTypes.URLContext.isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.authenticated) {
            const pathname = getNextPathname(this.props.location, '/');
            browserHistory.push(pathname);
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

    classes() {
        const { muiTheme } = this.context;
        return {
            default: {
                container: {
                    backgroundColor: '#ffffff',
                    boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.2)',
                    marginTop: '24px',
                    maxWidth: 600,
                    padding: '60px 0',
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
                    marginTop: 70,
                    maxHeight: 200,
                    maxWidth: '100%',
                    objectFit: 'contain',
                },
                paperContainer: {
                    position: 'absolute',
                    top: '320px',
                    width: '100%',
                },
                root: {
                    backgroundColor: muiTheme.luno.colors.offWhite,
                    height: '100vh',
                    paddingBottom: 20,
                    width: '100vw',
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
                    paddingTop: '24px',
                    position: 'relative',
                },
            },
        };
    }

    getHeaderText() {
        const accessRequest = isAccessRequest(this.props.location);
        if (this.context.url.subdomain && !accessRequest) {
            return t(`Sign in to ${this.context.url.subdomain}.lunohq.com`);
        } else if (accessRequest) {
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
                    <img src={organizationImageUrl} style={this.styles().organizationImage} />
                </div>
            );
        } else {
            return <div style={{height: this.styles().organizationImage.maxHeight}} />;
        }
    }

    renderLoginForm() {
        const accessRequest = isAccessRequest(this.props.location);
        if (this.context.url.subdomain && !accessRequest && !this.props.email && !this.props.organizationDomain) {
            return (
                <div className="row center-xs">
                    <CircularProgress mode="indeterminate" size={0.5} />
                </div>
            );
        } else if (accessRequest) {
            const { userInfo } = this.props.location.query;
            return (
                <LoginRequestAccess
                    onRequestAccess={() => {
                        const user = atob(userInfo);
                        return this.props.dispatch(requestAccess(this.context.url.subdomain, user));
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
                        return dispatch(getAuthenticationInstructions(email, this.context.url));
                    }}
                    location={this.props.location}
                    providerName={this.props.providerName}
                    userExists={this.props.userExists}
                />
            );
        }
    }

    render() {
        return (
            <div style={this.styles().root}>
                <div className="wrap" style={this.styles().wrap}>
                    {this.renderOrganizationImage()}
                    <div className="row center-xs" style={this.styles().paperContainer}>
                        <Paper style={this.styles().container}>
                            <div className="row center-xs">
                                <h1 style={this.styles().header}>{this.getHeaderText()}</h1>
                            </div>
                            <div className="row center-xs">
                                <div className="col-xs-12" style={this.styles().form}>
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
