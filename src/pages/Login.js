'use strict';

import _ from 'lodash';
import AltContainer from 'alt/AltContainer';
import connectToStores from 'alt/utils/connectToStores';
import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react/addons';

import AppStoreBadge from '../images/AppStoreBadge.svg'
import constants from '../styles/constants';
import LoginForm from '../components/LoginForm';
import ThemeManager from '../utils/ThemeManager';

@connectToStores
@decorate(Navigation)
@decorate(React.addons.LinkedStateMixin)
class Login extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        authBackend: React.PropTypes.number,
        authError: React.PropTypes.object,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    static getStores(props) {
        return [
            props.flux.getStore('AuthStore'),
            props.flux.getStore('RequestStore'),
        ];
    }

    static getPropsFromStores(props) {
        return _.assign(
            {},
            props.flux.getStore('AuthStore').getState(),
            props.flux.getStore('RequestStore').getState(),
        );
    }

    // TODO we shouldn't have to specify this on all the view controllers
    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const loggedIn = this.props.flux
            .getStore('AuthStore')
            .isLoggedIn();

        if (loggedIn) {
            // Need to call setTimeout here so it happens on the next tick
            setTimeout(() => this.transitionTo(this.props.location.nextPathname || 'people'));
            return false;
        }
        return true;
    }

    styles = {
        root: {
            backgroundColor: constants.colors.background,
            minHeight: '100vh',
        },
        appBadgesTitleContainer: {
            marginTop: "150px",
        },
        appBadgesContainer: {
            marginTop: "20px",
        },
        appBadgesTitle: {
            color: "white",
            fontSize: "16px",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "3px",
        },
        appStoreBadge: {
            width: '151px',
            marginRight: '80px',
        },
    }

    render() {
        return (
            <div style={this.styles.root}>
                <div className="wrap" style={{marginBottom: 0}}>
                    <AltContainer
                        actions={this.props.flux.getActions('AuthActions')}
                        inject={{
                            authError: this.props.authError,
                        }}
                        component={LoginForm} />
                    <div className="row center-xs" style={this.styles.appBadgesTitleContainer}>
                        <h2 style={this.styles.appBadgesTitle}>Get the mobile apps</h2>
                    </div>
                    <div className="row center-xs" style={this.styles.appBadgesContainer}>
                        <a href="https://itunes.apple.com/us/app/circle-connect-your-co-workers/id981648781?ls=1&mt=8" target="_blank">
                            <img style={this.styles.appStoreBadge} alt="Download on the AppStore" src={AppStoreBadge} />
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
