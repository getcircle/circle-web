import { RaisedButton, Snackbar } from 'material-ui';
import React, { PropTypes } from 'react/addons';
import { services } from 'protobufs';

import { fontColors, fontWeights } from '../constants/styles';
import { login } from '../utils/google';
import logger from '../utils/logger';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

class LoginForm extends CSSComponent {

    static propTypes = {
        authError: PropTypes.string,
        authenticate: PropTypes.func.isRequired,
    }

    componentDidUpdate() {
        if (this.props.authError) {
            logger.error(`Error logging in: ${JSON.stringify(this.props.authError)}`);
            this.refs.snackbar.show();
        }
    }

    backends = services.user.actions.authenticate_user.RequestV1.AuthBackendV1

    classes() {
        return {
            default: {
                button: {
                    width: '100%',
                    backgroundColor: 'rgb(0, 201, 255)',
                    height: 50,
                    maxWidth: 400,
                },
                container: {
                    paddingTop: '15%',
                },
                label: {
                    lineHeight: '50px',
                    fontSize: 18,
                    ...fontWeights.light,
                },
                header: {
                    fontSize: 36,
                    paddingBottom: 20,
                    ...fontColors.white,
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
            }
        }
    }

    handleTouchTap() {
        login()
            .then((details) => {
                this.props.authenticate(this.backends.GOOGLE, details.code);
            })
            .catch((error) => {
                logger.error(`Error logging in: ${error}`);
                this.refs.snackbar.show();
            });
    }


    render() {
        return (
            <div className="row" is="container">
                <section className="col-xs" is="section">
                    <div>
                        <div className="row center-xs">
                            <h1 is="header">luno</h1>
                        </div>
                        <div className="row center-xs">
                            <h2 is="subHeader">{t('organizing your company\'s knowledge')}</h2>
                        </div>
                        <div className="row center-xs">
                            <RaisedButton
                                is="button"
                                label={`${ t('START USING LUNO') }`}
                                labelStyle={this.styles().label}
                                onTouchTap={this.handleTouchTap.bind(this)}
                                primary={true}
                            />
                        </div>
                    </div>
                </section>

                <Snackbar message="Error logging in" ref="snackbar" />
            </div>
        );
    }

}

export default LoginForm;
