'use strict';

import _ from 'lodash';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react/addons';

import autoBind from '../utils/autobind';
import AuthStore from '../stores/AuthStore';
import logger from '../utils/logger';
import t from '../utils/gettext';

const RaisedButton = mui.RaisedButton;
const StylePropable = mui.Mixins.StylePropable;
const TextField = mui.TextField;

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
@decorate(React.addons.LinkedStateMixin)
class LoginForm extends React.Component {

    static propTypes = {
        authenticate: React.PropTypes.func.isRequired,
        backend: React.PropTypes.oneOf(_.values(AuthStore.backends)),
        getAuthenticationInstructions: React.PropTypes.func.isRequired,
    }

    constructor() {
        super();
        this.state = {
            email: null,
            emailErrorText: null,
            password: null,
            passwordErrorText: null,
            loading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.backend === AuthStore.backends.GOOGLE && !this.state.loading) {
            this.setState({loading: true});
            this._startGoogleClient()
                .then(({googleClient}) => {
                    this._loginWithGoogle(googleClient);
                })
                .catch((error) => {
                    logger.log(`Error strating google client: ${error}`);
                });
        }
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

    _startGoogleClient() {
        return new Promise((resolve, reject) => {
            window.gapi.load('auth2', () => {
                let googleClient = window.gapi.auth2.getAuthInstance();
                if (googleClient === null) {
                    googleClient = window.gapi.auth2.init({
                        /*eslint-disable camelcase*/
                        // TODO: should be coming from settings
                        client_id: '1077014421904-1a697ks3qvtt6975qfqhmed8529en8s2.apps.googleusercontent.com',
                        scope: (
                            'https://www.googleapis.com/auth/plus.login ' +
                            'https://www.googleapis.com/auth/plus.profile.emails.read'
                        ),
                        /*eslint-enable camelcase*/
                    });
                }
                return resolve({googleClient});
            });
        });
    }

    _loginWithGoogle(googleClient) {
        googleClient.grantOfflineAccess({
            'redirect_uri': 'postmessage',
        })
            .then((details) => {
                const idToken = googleClient.currentUser
                    .get()
                    .getAuthResponse()
                        .id_token;
                this.props.authenticate(AuthStore.backends.GOOGLE, details.code, idToken);
            });
    }

    _handleTouchTap = this._handleTouchTap.bind(this);
    _handleTouchTap(event) {
        event.preventDefault();
        if (this.props.backend === AuthStore.backends.INTERNAL) {
            this.props.authenticate(this.props.backend, this.state.email, this.state.password);
        } else {
            this.props.getAuthenticationInstructions(this.state.email);
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
        };
    }

    _getPasswordField(styles) {
        if (this.props.backend === AuthStore.backends.INTERNAL) {
            return <TextField
                    key="password"
                    style={styles.common}
                    type="password"
                    floatingLabelText="Password"
                    valueLink={this.linkState('password')}
                    errorText={this.state.passwordErrorText}
                />;
        }
    }

    _canSubmit() {
        return !this.props.inProgress;
        // if (this.props.inProgress) {
        //     return false;
        // }

        // if (this.props.shouldUseInternalLogin) {
        //     return this._validateInputs(false);
        // } else if (this.state.email !== null && this.state.email !== '') {
        //     return true;
        // }
        // return false;
    }

    render() {
        const styles = this._getStyles();
        return (
            <section style={styles.section}>
                <h1>{ t('Login') }</h1>
                <TextField
                    floatingLabelText="Work Email Address"
                    valueLink={this.linkState('email')}
                    errorText={this.state.emailErrorText}
                    style={styles.common}
                />
                {this._getPasswordField(styles)}
                <RaisedButton
                    label={`${ t('Login') }`}
                    style={this.mergeStyles(styles.common, styles.button)}
                    primary={true}
                    onTouchTap={this._handleTouchTap}
                    // TODO should be checking if valid email first
                    disabled={this._canSubmit() ? false : true}
                />
            </section>
        );
    }

}

export default LoginForm;
