import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';

import AppStoreBadge from '../images/AppStoreBadge.svg'
import { authenticate, getAuthenticationInstructions } from '../actions/authentication';
import { backgroundColors } from '../constants/styles';
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
            authorizationUrl: authenticationState.get('authorizationUrl'),
            backend: authenticationState.get('backend'),
            userExists: authenticationState.get('userExists'),
        }
    },
)

@connect(selector)
class Login extends CSSComponent {

    static propTypes = {
        authError: PropTypes.object,
        authenticated: PropTypes.bool,
        authorizationUrl: PropTypes.string,
        backend: PropTypes.number,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        userExists: PropTypes.bool,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }),
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.authenticated) {
            this.context.router.transitionTo(this.props.location.nextPathname || '/');
            return false;
        }
        return true;
    }

    classes() {
        return {
            default: {
                appBadgesTitleContainer: {
                    marginTop: '100px',
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
                },
                root: {
                    minHeight: '100vh',
                    ...backgroundColors.dark,
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
                        authorizationUrl={this.props.authorizationUrl}
                        backend={this.props.backend}
                        getAuthenticationInstructions={(email) => dispatch(getAuthenticationInstructions(email))}
                        userExists={this.props.userExists}
                    />
                    <div className="row center-xs" is="appBadgesTitleContainer">
                        <h2 is="appBadgesTitle">{t('Get the mobile app')}</h2>
                    </div>
                    <div className="row center-xs" is="appBadgesContainer">
                        <a href="https://itunes.apple.com/us/app/circle-connect-your-co-workers/id981648781?ls=1&mt=8" target="_blank">
                            <img alt="Download on the AppStore" is="appStoreBadge" src={AppStoreBadge} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
