import * as mui from 'material-ui';
import React from 'react/addons';
import {decorate} from 'react-mixin';

import * as authActions from '../../actions/auth';
import authStore from '../../stores/auth';
import client from '../../services/client';
import t from '../../utils/gettext';

const Colors = mui.Styles.Colors;
const RaisedButton = mui.RaisedButton;
const TextField = mui.TextField;
const ThemeManager = new mui.Styles.ThemeManager();


@decorate(React.addons.LinkedStateMixin)
class LoginForm extends React.Component {

    constructor() {
        super();
        this.state = {
            isAuthenticated: false,
            email: null,
            password: null,
            emailErrorText: null,
            passwordErrorText: null
        }
        this.handleAuthStoreChange = this.handleAuthStoreChange.bind(this);
        this._handleTouchTap = this._handleTouchTap.bind(this);
    }

    static get childContextTypes() {
        return {
            muiTheme: React.PropTypes.object
        };
    }

    componentDidMount() {
        authStore.addChangeListener(this.handleAuthStoreChange);
    }

    componentWillUnmount() {
        authStore.removeChangeListener(this.handleAuthStoreChange);
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }

    handleAuthStoreChange() {
        this.setState({
            // XXX why does the initial state not refer to auth store? #parris-question
            isAuthenticated: authStore.isAuthenticated()
        });
    }

    _validateInputs() {
        let valid = true
        if (this.state.email === null || this.state.email.trim() === '') {
            this.setState({emailErrorText: t('Email is required')});
            valid = false;
        }
        if (this.state.password === null || this.state.password.trim() === '') {
            this.setState({passwordErrorText: t('Password is required')});
            valid = false;
        }
        return valid;
    }

    _handleTouchTap(event) {
        event.preventDefault();
        let valid = this._validateInputs();
        if (valid) {
            authActions.authenticate(this.state.email, this.state.password);
        }
    }

    render() {
        let authenticationState = this.state.isAuthenticated ? 'authenticated' : 'unauthenticated';
        return (
            <div>
                <h2>{ t('Login Form') }</h2>
                <p>User is {authenticationState}.</p>
                <TextField
                    ref="email"
                    floatingLabelText="Work Email Address"
                    valueLink={this.linkState('email')}
                    errorText={this.state.emailErrorText}
                />
                <TextField
                    ref="password"
                    type="password"
                    floatingLabelText="Password"
                    valueLink={this.linkState('password')}
                    errorText={this.state.passwordErrorText}
                />
                <RaisedButton label={`${ t('Login') }`} primary={true} onTouchTap={this._handleTouchTap} />
            </div>
        );
    }

}

export default LoginForm;
