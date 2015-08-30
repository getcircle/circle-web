import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';

import AppStoreBadge from '../images/AppStoreBadge.svg'
import { authenticate } from '../actions/authentication';
import constants from '../styles/constants';
import t from '../utils/gettext';
import * as selectors from '../selectors';

import CSSComponent from '../components/CSSComponent';
import LoginForm from '../components/LoginForm';

const selector = createSelector(
    [selectors.authenticationSelector],
    (authenticationState) => {
        return {
            authError: authenticationState.get('authError'),
            authenticated: authenticationState.get('authenticated'),
        }
    },
)

@connect(selector)
class Login extends CSSComponent {

    static propTypes = {
        authError: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
    }

    static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.authenticated) {
            this.transitionTo(this.props.location.nextPathname || '/');
            return false;
        }
        return true;
    }

    classes() {
        return {
            default: {
                root: {
                    backgroundColor: constants.colors.background,
                    minHeight: '100vh',
                },
                appBadgesTitleContainer: {
                    marginTop: '150px',
                },
                appBadgesContainer: {
                    marginTop: '20px',
                },
                appBadgesTitle: {
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                },
                appStoreBadge: {
                    width: '151px',
                    marginRight: '80px',
                },
                wrap: {
                    marginBottom: 0,
                },
            }
        }
    }

    render() {
        const { dispatch } = this.props;
        return (
            <div is="root">
                <div className="wrap" is="wrap">
                    <LoginForm
                        authError={this.props.authError}
                        authenticate={(...args) => dispatch(authenticate(...args))}
                    />
                    <div className="row center-xs" is="appBadgesTitleContainer">
                        <h2 is="appBadgesTitle">{t('Get the mobile apps')}</h2>
                    </div>
                    <div className="row center-xs" is="appBadgesContainer">
                        <a href="https://itunes.apple.com/us/app/circle-connect-your-co-workers/id981648781?ls=1&mt=8" target="_blank">
                            <img alt="Download on the AppStore" is="appStoreBadge" src={AppStoreBadge} />
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.rhlabs.circle" target="_blank">
                            <img alt="Get it on Google Play" src="https://developer.android.com/images/brand/en_generic_rgb_wo_45.png" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
