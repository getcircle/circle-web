import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors, fontWeights } from '../constants/styles';
import logger from '../utils/logger';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

const {
    RaisedButton,
    Snackbar,
    TextField,
} = mui;

const BACKENDS = services.user.actions.authenticate_user.RequestV1.AuthBackendV1

class LoginForm extends CSSComponent {

    static propTypes = {
        authError: PropTypes.string,
        authenticate: PropTypes.func.isRequired,
        authorizationUrl: PropTypes.string,
        backend: PropTypes.number,
        getAuthenticationInstructions: PropTypes.func.isRequired,
        userExists: PropTypes.bool,
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.userExists) {
            this.setState({buttonLabelText: t('Sign In')});
        }
    }

    componentDidUpdate() {
        if (this.props.authError) {
            logger.error(`Error logging in: ${JSON.stringify(this.props.authError)}`);
            this.refs.snackbar.show();
        }
    }

    state = {
        buttonLabelText: t('Start Using Luno'),
        email: '',
        password: '',
    }

    styles() {
        return this.css({
            internalAuthentication: this.props.backend === 0,
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
                    backgroundColor: 'rgb(0, 201, 255)',
                    height: 50,
                    textTransform: 'uppercase',
                    ...common.action,
                },
                container: {
                    paddingTop: '15%',
                },
                inputSection: {
                    paddingBottom: 10,
                },
                header: {
                    fontSize: 36,
                    paddingBottom: 20,
                    ...fontColors.white,
                },
                label: {
                    lineHeight: '50px',
                    fontSize: 18,
                    ...fontWeights.light,
                },
                passwordSection: {
                    display: 'none',
                },
                section: {
                    marginLeft: 20,
                    marginRight: 20,
                },
                subHeader: {
                    fontSize: 26,
                    paddingBottom: 70,
                    ...fontColors.white,
                },
                TextInput: {
                    style: {
                        ...common.action,
                    },
                    inputStyle: {
                        ...fontColors.white,
                    },
                },
            },
            internalAuthentication: {
                passwordSection: {
                    display: 'initial',
                },
            },
        }
    }

    handleChange(newValue) {
        this.setState({email: newValue});
    }

    handleTouchTap() {
        if (this.props.backend === null || this.props.backend === undefined) {
            this.props.getAuthenticationInstructions(this.state.email);
        } else {
            // internal auth
            this.props.authenticate(this.props.backend, this.state.email, this.state.password);
        }
    }

    render() {
        return (
            <div className="row" is="container">
                <section className="col-xs" is="section">
                    <div>
                        <div className="row center-xs">
                            <h1 is="header">{t('luno')}</h1>
                        </div>
                        <div className="row center-xs">
                            <h2 is="subHeader">{t('organizing your company\'s knowledge')}</h2>
                        </div>
                        <div className="row center-xs" is="inputSection">
                            <div className="col-xs-12">
                                <TextField
                                    hintText={t('Work email address')}
                                    is="TextInput"
                                    valueLink={{
                                        value: this.state.email,
                                        requestChange: (newValue) => this.setState({email: newValue}),
                                    }}
                                />
                            </div>
                            <div className="col-xs-12" is="passwordSection">
                                <TextField
                                    hintText={t('Password')}
                                    is="TextInput"
                                    type="password"
                                    valueLink={{
                                        value: this.state.password,
                                        requestChange: (newValue) => this.setState({password: newValue}),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row center-xs">
                            <RaisedButton
                                is="button"
                                label={this.state.buttonLabelText}
                                labelStyle={this.styles().label}
                                onTouchTap={::this.handleTouchTap}
                                primary={true}
                            />
                        </div>
                    </div>
                </section>
                <Snackbar message={t('Error logging in')} ref="snackbar" />
            </div>
        );
    }

}

export default LoginForm;
