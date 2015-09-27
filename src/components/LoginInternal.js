import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { AUTH_BACKENDS } from '../services/user';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import LoginEmailInput from './LoginEmailInput';

const {
    RaisedButton,
    TextField,
} = mui;

class LoginInternal extends CSSComponent {

    static propTypes = {
        email: PropTypes.string,
        guest: PropTypes.bool,
        hasAlternative: PropTypes.bool,
        onGuestSubmit: PropTypes.func,
        onLogin: PropTypes.func.isRequired,
        onUseAlternative: PropTypes.func,
    }

    static defaultProps = {
        guest: false,
        hasAlternative: false,
        onGuestSubmit: () => {},
        onUseAlternative: () => {},
    }

    state = {
        email: '',
        password: '',
    }

    componentWillMount() {
        this.mergeState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.mergeState(this.props);
    }

    mergeState(props) {
        const { email } = props;
        if (email) {
            this.setState({email});
        }
    }

    classes() {
        return {
            'guest-true': {
                passwordDiv: {
                    display: 'none',
                },
            },
        };
    }

    canSubmit() {
        if (
            this.state.email === '' ||
            (!this.props.guest && this.state.password === '')
        ) {
            return false;
        } else {
            return true;
        }
    }

    handleSubmit() {
        const { email, password } = this.state;
        if (this.props.guest) {
            this.props.onGuestSubmit(email);
        } else if (email && password) {
            this.props.onLogin(AUTH_BACKENDS.INTERNAL, this.state.email, this.state.password);
        }
    }

    handleEnter() {
        const { email } = this.state;
        if (email !== '') {
            if (this.props.guest) {
                return this.props.onGuestSubmit(email);
            }
        }
    }

    renderUseAlternativeSection() {
        if (this.props.hasAlternative) {
            return (
                <section>
                    <div>
                        <span>{t('Or, ')}</span><a onTouchTap={this.props.onUseAlternative}>{t('use your team\'s Single sign-on authentication')}</a>
                    </div>
                </section>
            );
        }
    }

    render() {
        return (
            <section>
                <section>
                    <div>
                        <LoginEmailInput
                            onChange={(event) => this.setState({email: event.target.value})}
                            onEnter={::this.handleEnter}
                            value={this.state.email}
                        />
                    </div>
                    <div is="passwordDiv">
                        <TextField
                            hintText={t('password')}
                            onEnterKeyDown={::this.handleSubmit}
                            ref={(input) => {
                                if (input !== null && this.state.email !== '' && this.state.password === '') {
                                    input.focus();
                                }
                            }}
                            type="password"
                            valueLink={{
                                value: this.state.password,
                                requestChange: (newValue) => this.setState({password: newValue}),
                            }}
                        />
                    </div>
                    <RaisedButton
                        disabled={!this.canSubmit()}
                        label={t('Sign in')}
                        onTouchTap={::this.handleSubmit}
                        primary={true}
                        ref="primary"
                    />
                </section>
                {this.renderUseAlternativeSection()}
            </section>
        );
    }

}

export default LoginInternal;
