import * as mui from 'material-ui';
import React from 'react/addons';
import {decorate} from 'react-mixin';

import AuthActions from '../../../actions/AuthActions';
import t from '../../../utils/gettext';
import autoBind from '../../../utils/autobind';

const ClearFix = mui.ClearFix;
const Colors = mui.Styles.Colors;
const RaisedButton = mui.RaisedButton;
const StylePropable = mui.Mixins.StylePropable;
const TextField = mui.TextField;
const ThemeManager = new mui.Styles.ThemeManager();


@decorate(StylePropable)
@decorate(autoBind(StylePropable))
@decorate(React.addons.PureRenderMixin)
@decorate(React.addons.LinkedStateMixin)
class LoginForm extends React.Component {

    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            emailErrorText: null,
            passwordErrorText: null
        };
        this._handleTouchTap = this._handleTouchTap.bind(this);
    }

    static get childContextTypes() {
        return {
            muiTheme: React.PropTypes.object
        };
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }

    getStyles() {
        return {
            common: {
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
            },
            button: {
                marginTop: 25,
                maxWidth: 256
            }
        };
    }

    _validateInputs() {
        let valid = true;
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
            AuthActions.authenticate(this.state.email, this.state.password);
        }
    }

    render() {
        let styles = this.getStyles();

        return (
            <div>
                <TextField
                    ref="email"
                    style={styles.common}
                    floatingLabelText="Work Email Address"
                    valueLink={this.linkState('email')}
                    errorText={this.state.emailErrorText}
                />
                <TextField
                    ref="password"
                    style={styles.common}
                    type="password"
                    floatingLabelText="Password"
                    valueLink={this.linkState('password')}
                    errorText={this.state.passwordErrorText}
                />
                <RaisedButton
                    label={`${ t('Login') }`}
                    style={this.mergeStyles(styles.common, styles.button)}
                    primary={true}
                    onTouchTap={this._handleTouchTap}
                />
            </div>
        );
    }

}

export default LoginForm;
