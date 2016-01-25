import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { AUTH_BACKENDS } from '../services/user';
import { fontWeights, tintColor } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import InternalPropTypes from './InternalPropTypes';
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

    static contextTypes = {
        url: InternalPropTypes.URLContext,
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
        const { url } = this.context;
        if (this.props.guest) {
            this.props.onGuestSubmit(email, url);
        } else if (email && password) {
            this.props.onLogin(AUTH_BACKENDS.INTERNAL, this.state.email, this.state.password, url.subdomain);
        }
    }

    handleEnter() {
        const { email } = this.state;
        if (email !== '') {
            if (this.props.guest) {
                return this.props.onGuestSubmit(email, this.context.url);
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
                <div style={this.styles().alternativeDiv}>
                    <span style={this.styles().alternative}>
                        {t('Or, ')}
                        <a
                            onTouchTap={this.props.onUseAlternative}
                            style={this.styles().alternativeLink}
                        >
                            {t('use your team\'s Single Sign-On authentication.')}
                        </a>
                    </span>
                </div>
            );
        }
    }

    render() {
        return (
            <section>
                <div style={this.styles().headerDiv}>
                    <span style={this.styles().header}>{this.renderHeader()}</span>
                </div>
                <section>
                    <div className="col-xs-12">
                        <LoginEmailInput
                            onChange={(event) => this.setState({email: event.target.value})}
                            onEnter={::this.handleEnter}
                            style={this.styles().input}
                            value={this.state.email}
                        />
                    </div>
                    <div className="col-xs-12" style={this.styles().passwordDiv}>
                        <TextField
                            hintText={t('password')}
                            onEnterKeyDown={::this.handleSubmit}
                            ref={(input) => {
                                if (input !== null && this.state.email !== '' && this.state.password === '') {
                                    input.focus();
                                }
                            }}
                            style={this.styles().input}
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
                            label={t('Sign in')}
                            onTouchTap={::this.handleSubmit}
                            primary={true}
                            ref="primary"
                            style={this.styles().button}
                        />
                    </div>
                </section>
                {this.renderUseAlternativeSection()}
            </section>
        );
    }

}

export default LoginInternal;
