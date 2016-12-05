import React, { PropTypes } from 'react';

import { Snackbar } from 'material-ui';

import { AUTH_BACKENDS } from '../services/user';
import { fontColors, fontWeights } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import LoginInternal from './LoginInternal';
import LoginSSO from './LoginSSO';

class LoginForm extends CSSComponent {

    static propTypes = {
        authError: PropTypes.bool,
        authenticate: PropTypes.func.isRequired,
        authorizationUrl: PropTypes.string,
        backend: PropTypes.number,
        email: PropTypes.string,
        getAuthenticationInstructions: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        providerName: PropTypes.string,
        userExists: PropTypes.bool,
    }

    state = {
        authorizationUrl: '',
        guest: true,
        hasSingleSignOn: false,
        internal: false,
        providerName: '',
        singleSignOn: false,
        snackbarOpen: false,
    }

    componentWillMount() {
        this.mergeState(this.props, this.state);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.email && this.state.guest) {
            this.setState({guest: false});
        }
        this.mergeState(nextProps, nextState);
    }

    mergeState(props, state) {
        if (props.backend === AUTH_BACKENDS.INTERNAL) {
            this.setState({internal: true});
        } else if ([AUTH_BACKENDS.GOOGLE, AUTH_BACKENDS.OKTA].indexOf(props.backend) !== -1) {
            this.setState({
                singleSignOn: true,
                guest: false,
                hasSingleSignOn: true,
                authorizationUrl: props.authorizationUrl,
                providerName: props.providerName,
            });
        } else if (props.authError) {
            this.setState({guest: true, snackbarOpen: true});
        }
    }

    styles() {
        return this.css({
            internal: this.state.internal,
            singleSignOn: this.state.singleSignOn,
        });
    }

    classes() {
        const common = {
            action: {
                width: '100%',
                maxWidth: 400,
            },
        }
        return {
            default: {
                button: {
                    height: 50,
                    marginTop: 20,
                    textTransform: 'uppercase',
                    ...common.action,
                },
                primaryButton: {
                    Extend: 'button',
                },
                header: {
                    fontSize: '18px',
                    ...fontWeights.light,
                },
                headerSection: {
                    paddingBottom: '2%',
                },
                label: {
                    lineHeight: '50px',
                    fontSize: 18,
                    ...fontWeights.light,
                },
                passwordSection: {
                    display: 'none',
                },
                secondaryButton: {
                    Extend: 'button',
                },
                secondaryButtonSection: {
                    display: 'none',
                },
                TextInput: {
                    style: {
                        ...common.action,
                    },
                    inputStyle: {
                        ...fontColors.dark,
                    },
                },
            },
            'internal': {
                secondaryButtonSection: {
                    display: 'none',
                },
                passwordSection: {
                    display: 'block',
                },
            },
            'singleSignOn': {
                emailSection: {
                    display: 'none',
                },
                passwordSection: {
                    display: 'none',
                },
                secondaryButtonSection: {
                    display: 'block',
                },
            },
        };
    }

    renderInputSection() {
        const {
            guest,
            hasSingleSignOn,
            internal,
            singleSignOn,
        } = this.state;
        const {
            authenticate,
            authorizationUrl,
            email,
            getAuthenticationInstructions,
            providerName,
        } = this.props;
        if (guest || internal) {
            return (
                <LoginInternal
                    email={email}
                    guest={guest}
                    hasAlternative={hasSingleSignOn}
                    onGuestSubmit={(...args) => {
                        return getAuthenticationInstructions(...args);
                    }}
                    onLogin={authenticate}
                    onUseAlternative={() => {
                        this.setState({guest: false, singleSignOn: true, internal: false})
                    }}
                />
            );
        } else if (singleSignOn) {
            return (
                <LoginSSO
                    authorizationUrl={authorizationUrl || this.state.authorizationUrl}
                    location={this.props.location}
                    onGuestLogin={() => {
                        this.setState({guest: true, singleSignOn: false});
                    }}
                    providerName={providerName || this.state.providerName}
                />
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderInputSection()}
                <Snackbar
                    message={t('Error logging in')}
                    onRequestClose={() => {this.setState({snackbarOpen: false})}}
                    open={this.state.snackbarOpen}
                    ref="snackbar"
                />
            </div>
        );
    }

}

export default LoginForm;
