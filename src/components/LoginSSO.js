import mui from 'material-ui';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

const {
    RaisedButton,
} = mui;

class LoginSSO extends CSSComponent {

    static propTypes = {
        authorizationUrl: PropTypes.string.isRequired,
        onGuestLogin: PropTypes.func.isRequired,
        providerName: PropTypes.string.isRequired,
    }

    handleRedirect() {
        window.location = this.props.authorizationUrl;
    }

    render() {
        const {
            onGuestLogin,
            providerName,
        } = this.props;
        return (
            <section>
                <section>
                    <div>
                        <span>{t(`Your team uses ${providerName} for single sign on`)}</span>
                    </div>
                    <RaisedButton
                        label={t(`Sign in with ${providerName}`)}
                        onTouchTap={::this.handleRedirect}
                        primary={true}
                    />
                </section>
                <section>
                    <div>
                        <span>{t('Or sign in using a ')}<a onTouchTap={onGuestLogin}>{t('guest account')}</a>.</span>
                    </div>
                </section>
            </section>
        );
    }

}

export default LoginSSO;
