'use strict';

import _ from 'lodash';
import AltContainer from 'alt/AltContainer';
import connectToStores from 'alt/utils/connectToStores';
import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react/addons';

import colors from '../styles/colors';
import LoginForm from '../components/LoginForm';
import ThemeManager from '../utils/ThemeManager';

@connectToStores
@decorate(Navigation)
@decorate(React.addons.LinkedStateMixin)
class Login extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        authBackend: React.PropTypes.number,
        inProgress: React.PropTypes.bool,
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
            setTimeout(() => this.transitionTo(this.props.location.nextPathname || 'feed'));
            return false;
        }

        return true;
    }

    styles = {
        root: {
            backgroundColor: colors.backgroundColor,
            minHeight: '100vh',
        }
    }

    render() {
        return (
            <div style={this.styles.root}>
                <div className="wrap">
                    <AltContainer
                        actions={this.props.flux.getActions('AuthActions')}
                        inject={{
                            backend: this.props.authBackend,
                            inProgress: this.props.inProgress,
                        }}
                        component={LoginForm} />
                </div>
            </div>
        );
    }
}

export default Login;
