import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { decorate } from 'react-mixin';
import React, { PropTypes } from 'react/addons';

import AppStoreBadge from '../images/AppStoreBadge.svg'
import { authenticate } from '../actions/authentication';
import constants from '../styles/constants';
import t from '../utils/gettext';
import * as selectors from '../selectors';

import LoginForm from '../components/LoginForm';
import PureComponent from '../components/PureComponent';

const selector = createSelector(
    [selectors.authenticationSelector],
    (authenticationState) => {
        return {
            authError: authenticationState.get('authError'),
            authenticated: authenticationState.get('authenticated'),
        }
    },
)

const styles = {
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
}

@connect(selector)
@decorate(React.addons.LinkedStateMixin)
class Login extends PureComponent {

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

    render() {
        const { dispatch } = this.props;
        return (
            <div style={styles.root}>
                <div className="wrap" style={{marginBottom: 0}}>
                    <LoginForm
                        authError={this.props.authError}
                        authenticate={(...args) => dispatch(authenticate(...args))}
                    />
                    <div className="row center-xs" style={styles.appBadgesTitleContainer}>
                        <h2 style={styles.appBadgesTitle}>{ t('Get the mobile apps') }</h2>
                    </div>
                    <div className="row center-xs" style={styles.appBadgesContainer}>
                        <a href="https://itunes.apple.com/us/app/circle-connect-your-co-workers/id981648781?ls=1&mt=8" target="_blank">
                            <img style={styles.appStoreBadge} alt="Download on the AppStore" src={AppStoreBadge} />
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
