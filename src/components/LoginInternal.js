import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { AUTH_BACKENDS } from '../services/user';
import { fontWeights, tintColor } from '../constants/styles';
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
            default: {
                alternativeDiv: {
                    marginTop: '3%',
                },
                alternative: {
                    fontSize: '13px',
                    ...fontWeights.light,
                },
                alternativeLink: {
                    color: tintColor,
                    cursor: 'pointer',
                },
                button: {
                    height: '50px',
                    width: '100%',
                },
                header: {
                    fontSize: '18px',
                    lineHeight: '22px',
                    ...fontWeights.light,
                },
                headerDiv: {
                    marginBottom: '3%',
                },
                input: {
                    width: '100%',
                },
            },
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

    renderHeader() {
        if (this.props.guest) {
            return t('Enter your email address to get started.');
        } else {
            return t('Enter your email address and password.');
        }
    }

    renderUseAlternativeSection() {
        if (this.props.hasAlternative) {
            return (
                <div is="alternativeDiv">
                    <span is="alternative">
                        {t('Or, ')}
                        <a
                            is="alternativeLink"
                            onTouchTap={this.props.onUseAlternative}
                        >
                            {t('use your team\'s Single sign-on authentication.')}
                        </a>
                    </span>
                </div>
            );
        }
    }

    render() {
        return (
            <section>
                <div is="headerDiv">
                    <span is="header">{this.renderHeader()}</span>
                </div>
                <section>
                    <div className="col-xs-12">
                        <LoginEmailInput
                            is="input"
                            onChange={(event) => this.setState({email: event.target.value})}
                            onEnter={::this.handleEnter}
                            value={this.state.email}
                        />
                    </div>
                    <div className="col-xs-12" is="passwordDiv">
                        <TextField
                            hintText={t('password')}
                            is="input"
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
                    <div className="col-xs-12">
                        <RaisedButton
                            disabled={!this.canSubmit()}
                            is="button"
                            label={t('Sign in')}
                            onTouchTap={::this.handleSubmit}
                            primary={true}
                            ref="primary"
                        />
                    </div>
                </section>
                {this.renderUseAlternativeSection()}
            </section>
        );
    }

}

export default LoginInternal;
