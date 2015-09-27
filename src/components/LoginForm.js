import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { AUTH_BACKENDS } from '../services/user';
import { fontColors, fontWeights } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import LoginInternal from './LoginInternal';
import LoginSSO from './LoginSSO';

const { Snackbar } = mui;

class LoginForm extends CSSComponent {

    static propTypes = {
        authError: PropTypes.string,
        authenticate: PropTypes.func.isRequired,
        authorizationUrl: PropTypes.string,
        backend: PropTypes.number,
        email: PropTypes.string,
        getAuthenticationInstructions: PropTypes.func.isRequired,
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

    componentDidUpdate() {
        if (this.props.authError) {
            this.refs.snackbar.show();
        }
    }

    mergeState(props, state) {
        if (props.backend === AUTH_BACKENDS.INTERNAL) {
            this.setState({internal: true});
        } else if ([AUTH_BACKENDS.GOOGLE, AUTH_BACKENDS.OKTA].includes(props.backend)) {
            this.setState({
                singleSignOn: true,
                guest: false,
                hasSingleSignOn: true,
                authorizationUrl: props.authorizationUrl,
                providerName: props.providerName,
            });
        } else if (props.authError) {
            this.setState({guest: true});
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
                container: {
                    paddingTop: '2%',
                },
                header: {
                    fontSize: '18px',
                    ...fontWeights.light,
                },
                headerSection: {
                    paddingBottom: '2%',
                },
                inputSection: {
                    paddingBottom: 10,
                    maxWidth: 400,
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
            <div className="row center-xs" is="container">
                <div className="col-xs-12" is="inputSection">
                    {this.renderInputSection()}
                </div>
                <Snackbar message={t('Error logging in')} ref="snackbar" />
            </div>
        );
    }

}

export default LoginForm;
