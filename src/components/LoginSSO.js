import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { fontWeights, tintColor } from '../constants/styles';
import { routeToURL } from '../utils/routes';
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

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    classes() {
        return {
            default: {
                button: {
                    height: '50px',
                    marginBottom: '5%',
                    marginTop: '5%',
                    width: '100%',
                },
                guest: {
                    fontSize: '13px',
                    ...fontWeights.light,
                },
                guestLink: {
                    color: tintColor,
                    cursor: 'pointer',
                },
                header: {
                    fontSize: '18px',
                    lineHeight: '22px',
                    ...fontWeights.light,
                },
            },
        };
    }

    render() {
        const {
            onGuestLogin,
            providerName,
        } = this.props;
        const { nextPathname } = this.context.router.state.location.state;
        return (
            <section>
                <section>
                    <div>
                        <span is="header">{t(`Your team uses ${providerName} for Single Sign-On.`)}</span>
                    </div>
                    <RaisedButton
                        is="button"
                        label={t(`Sign in with ${providerName}`)}
                        onTouchTap={() => routeToURL(this.props.authorizationUrl, nextPathname)}
                        primary={true}
                    />
                </section>
                <section>
                    <div>
                        <span is="guest">
                            {t('Or sign in using a ')}
                            <a is="guestLink" onTouchTap={onGuestLogin}>{t('guest account')}</a>.
                        </span>
                    </div>
                </section>
            </section>
        );
    }

}

export default LoginSSO;
