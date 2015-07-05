'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react/addons';

import autoBind from '../utils/autobind';
import AuthStore from '../stores/AuthStore';
import colors from '../styles/colors';
import logger from '../utils/logger';
import t from '../utils/gettext';

const RaisedButton = mui.RaisedButton;
const StylePropable = mui.Mixins.StylePropable;

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class LoginForm extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: false,
        };
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
                this.setState({loading: false});
            });
    }

    _handleTouchTap = this._handleTouchTap.bind(this);
    _handleTouchTap(event) {
        event.preventDefault();
        this.setState({loading: true});
        this._startGoogleClient()
            .then(({googleClient}) => {
                this._loginWithGoogle(googleClient);
            })
            .catch((error) => {
                logger.log(`Error starting google client: ${error}`);
                this.setState({loading: false});
            });
    }

    _getStyles() {
        return {
            button: {
                width: '100%',
                backgroundColor: colors.tintColor,
                height: 50,
            },
            container: {
                marginTop: '15%',
            },
            label: {
                lineHeight: '50px',
                fontSize: 18,
            },
            text: {
                color: colors.lightTextColor,
            },
        };
    }

    render() {
        const styles = this._getStyles();
        return (
            <div style={styles.container} className="row center-xs">
                <section>
                    <div className="row center-xs">
                        <h1 style={styles.text}>{ t('circle') }</h1>
                    </div>
                    <div className="row center-xs">
                        <h2 style={styles.text}>{ t('know the people you work with.') }</h2>
                    </div>
                    <div className="row center-xs">
                        <RaisedButton
                            label={`${ t('START USING CIRCLE') }`}
                            style={styles.button}
                            labelStyle={styles.label}
                            primary={true}
                            onTouchTap={this._handleTouchTap}
                            disabled={this.state.loading}
                        />
                    </div>
                </section>
            </div>
        );
    }

}

export default LoginForm;
