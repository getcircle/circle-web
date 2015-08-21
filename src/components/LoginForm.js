import { RaisedButton, Snackbar } from 'material-ui';
import React, { PropTypes } from 'react/addons';
import { services } from 'protobufs';

import constants from '../styles/constants';
import { login } from '../utils/google';
import logger from '../utils/logger';
import t from '../utils/gettext';

import StyleableComponent from './StyleableComponent';

const styles = {
    button: {
        width: '100%',
        backgroundColor: constants.colors.tint,
        height: 50,
    },
    container: {
        paddingTop: '15%',
    },
    label: {
        lineHeight: '50px',
        fontSize: 18,
        fontWeight: 300,
    },
    text: {
        color: constants.colors.lightText,
    },
    header: {
        fontSize: 36,
        paddingBottom: 50,
    },
    subHeader: {
        fontSize: 26,
        paddingBottom: 20,
    },
}

class LoginForm extends StyleableComponent {

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

    _handleTouchTap() {
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
        const headerStyle = this.mergeAndPrefix(styles.text, styles.header);
        const subHeaderStyle = this.mergeAndPrefix(styles.text, styles.subHeader);
        return (
            <div className="row" style={styles.container}>
                <section className="col-sm-offset-4 col-sm-4">
                    <div>
                        <div className="row center-xs">
                            <h1 style={headerStyle}>{t('circle')}</h1>
                        </div>
                        <div className="row center-xs">
                            <h2 style={subHeaderStyle}>{t('know the people you work with')}</h2>
                        </div>
                        <div className="row center-xs">
                            <RaisedButton
                                label={`${ t('START USING CIRCLE') }`}
                                labelStyle={styles.label}
                                onTouchTap={this._handleTouchTap.bind(this)}
                                primary={true}
                                style={styles.button}
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
