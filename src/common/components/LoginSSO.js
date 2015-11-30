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
        history: PropTypes.object,
        location: PropTypes.object,
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

    getNextPathname() {
        if (this.context.location && this.context.location.state) {
            return this.context.location.state.nextPathname;
        }
    }

    render() {
        const {
            onGuestLogin,
            providerName,
        } = this.props;
        const nextPathname = this.getNextPathname();
        return (
            <section>
                <section>
                    <div>
                        <span style={this.styles().header}>{t(`Your team uses ${providerName} for Single Sign-On.`)}</span>
                    </div>
                    <RaisedButton
                        label={t(`Sign in with ${providerName}`)}
                        onTouchTap={() => routeToURL(this.props.authorizationUrl, nextPathname)}
                        primary={true}
                        style={this.styles().button}
                    />
                </section>
                <section>
                    <div>
                        <span style={this.styles().guest}>
                            {t('Or sign in using a ')}
                            <a onTouchTap={onGuestLogin} style={this.styles().guestLink}>{t('guest account')}</a>.
                        </span>
                    </div>
                </section>
            </section>
        );
    }

}

export default LoginSSO;
