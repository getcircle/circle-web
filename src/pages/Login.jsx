'use strict';

import connectToStores from 'alt/utils/connectToStores';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react/addons';

import autoBind from '../utils/autobind';
import t from '../utils/gettext';
import ThemeManager from '../utils/ThemeManager';

const RaisedButton = mui.RaisedButton;
const StylePropable = mui.Mixins.StylePropable;
const TextField = mui.TextField;
const Transitions = mui.Styles.Transitions;

@connectToStores
@decorate(Navigation)
@decorate(StylePropable)
@decorate(autoBind(StylePropable))
@decorate(React.addons.LinkedStateMixin)
class Login extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        shouldUseGoogleLogin: React.PropTypes.bool,
        shouldUseInternalLogin: React.PropTypes.bool,
    }

    static get childContextTypes() {
        return {
            muiTheme: React.PropTypes.object,
        };
    }

    static getStores(props) {
        return [props.flux.getStore('AuthStore')];
    }

    static getPropsFromStores(props) {
        return props.flux.getStore('AuthStore').getState();
    }

    constructor() {
        super();
        this.state = {
            email: null,
            emailErrorText: null,
            password: null,
            passwordErrorText: null,
        };
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillReceiveProps(nextProps) {
        const loggedIn = this.props.flux
            .getStore('AuthStore')
            .isLoggedIn();

        if (loggedIn) {
            this.transitionTo(this.props.location.nextPathname || 'feed');
        }

        if (nextProps.googleClient) {
            this._loginWithGoogle(nextProps.googleClient);
        } else if (nextProps.shouldUseGoogleLogin) {
            this.props.flux.getActions('AuthActions').startGoogleClient();
        }
    }

    _loginWithGoogle(googleClient) {
        googleClient.grantOfflineAccess({'redirect_uri': 'postmessage'})
            .then((details) => {
                const idToken = googleClient
                    .currentUser
                        .get()
                    .getAuthResponse()
                        .id_token;

                this.props.flux.getActions('AuthActions').authenticate(
                    this.props.flux.getStore('AuthStore').backends.GOOGLE,
                    details.code,
                    idToken,
                );
            });
    }

    _validateInputs() {
        let valid = true;
        if (
            this.state.email === null ||
            this.state.email.trim() === '' ||
            this.state.password === null ||
            this.state.password.trim() === ''

        ) {
            valid = false;
        }
        return valid;
    }

    _handleTouchTap = this._handleTouchTap.bind(this);
    _handleTouchTap(event) {
        event.preventDefault();
        const actions = this.props.flux.getActions('AuthActions');
        const store = this.props.flux.getStore('AuthStore');

        if (this.props.shouldUseInternalLogin) {
            actions.authenticate(store.backends.INTERNAL, this.state.email, this.state.password);
        } else {
            actions.getAuthenticationInstructions(this.state.email);
        }
    }

    _getStyles() {
        return {
            button: {
                marginTop: 25,
                width: 256,
            },
            common: {
                display: 'block',
                textAlign: 'center',
            },
            section: {
                textAlign: 'center',
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'center',
            },
            password: {
                transition: Transitions.easeOut(),
            }
        };
    }

    _getPasswordField() {
        const styles = this._getStyles();
        if (this.props.shouldUseInternalLogin) {
            return <TextField
                    key="password"
                    style={this.mergeStyles(styles.common, styles.password)}
                    type="password"
                    floatingLabelText="Password"
                    valueLink={this.linkState('password')}
                    errorText={this.state.passwordErrorText}
                />;
        }
    }

    _canSubmit() {
        if (this.props.shouldUseInternalLogin) {
            return this._validateInputs(false);
        } else if (this.state.email !== null && this.state.email !== '') {
            return true;
        }
        return false;
    }

    render() {
        const styles = this._getStyles();
        return (
            <div style={styles.container}>
                <section style={styles.section}>
                    <h1>{ t('Login') }</h1>
                    <TextField
                        floatingLabelText="Work Email Address"
                        valueLink={this.linkState('email')}
                        errorText={this.state.emailErrorText}
                        style={styles.common}
                    />
                    {this._getPasswordField()}
                    <RaisedButton
                        label={`${ t('Login') }`}
                        style={this.mergeStyles(styles.common, styles.button)}
                        primary={true}
                        onTouchTap={this._handleTouchTap}
                        // TODO should be checking if valid email first
                        disabled={this._canSubmit() ? false : true}
                    />
                </section>
            </div>
        );
    }
}

export default Login;
