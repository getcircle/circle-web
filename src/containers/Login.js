import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';

import {
    authenticate,
    getAuthenticationInstructions,
} from '../actions/authentication';
import { AUTH_BACKENDS } from '../services/user';
import { fontColors, fontWeights } from '../constants/styles';
import * as selectors from '../selectors';
import { getSubdomain } from '../utils/subdomains';
import t from '../utils/gettext';

import CSSComponent from '../components/CSSComponent';
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
        providerName: PropTypes.string,
        subdomain: PropTypes.string,
        userExists: PropTypes.bool,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }),
    }

    static defaultProps = {
        subdomain: getSubdomain(),
    }

    componentWillMount() {
        if (this.props.subdomain) {
            this.props.dispatch(getAuthenticationInstructions(null, this.props.subdomain));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.authenticated) {
            this.context.router.transitionTo(this.props.location.nextPathname || '/');
            return false;
        }
        return true;
    }

    classes() {
        return {
            default: {
                container: {
                    marginTop: '10%',
                    paddingTop: '5%',
                    paddingBottom: '5%',
                    width: '66%',
                },
                header: {
                    fontSize: 28,
                    paddingBottom: 20,
                    ...fontColors.dark,
                    ...fontWeights.semiBold,
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
                },
            }
        }
    }

    getHeaderText() {
        if (this.props.subdomain) {
            return t(`Sign in to ${window.location.host}`);
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

    renderLoginForm() {
        if (!this.props.email && !this.props.organizationDomain) {
            return (
                <div className="row center-xs">
                    <CircularProgress mode="indeterminate" size={0.5} />
                </div>
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
                    <div className="row center-xs">
                        <Paper is="container">
                            <div className="row center-xs">
                                <h1 is="header">{this.getHeaderText()}</h1>
                            </div>
                            {this.renderLoginForm()}
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
