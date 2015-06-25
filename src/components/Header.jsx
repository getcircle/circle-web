'use strict';

import connectToStores from 'alt/utils/connectToStores';
import { decorate } from 'react-mixin';
import { Link, Navigation } from 'react-router';
import mui from 'material-ui';
import React from 'react';

import colors from '../styles/colors';
import t from '../utils/gettext';

const Tabs = mui.Tabs;
const Tab = mui.Tab;

@connectToStores
@decorate(Navigation)
class Header extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
    }

    static getStores(props) {
        return [props.flux.getStore('AuthStore')];
    }

    static getPropsFromStores(props) {
        return props.flux.getStore('AuthStore').getState();
    }

    _getStyles() {
        return {
            link: {
                color: 'white',
                display: 'block',
                marginTop: 10,
            },
            tabs: {
                backgroundColor: colors.headerBackgroundColor,
            },
            tab: {
                marginLeft: 46,
            },
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.flux.getStore('AuthStore').isLoggedIn()) {
            this.transitionTo('login');
        }
    }

    _handleLogout = this._handleLogout.bind(this);
    _handleLogout(event) {
        // Prevent the link from resolving, we need to wait for logout to succeed
        event.preventDefault();
        this.props.flux
            .getActions('AuthActions')
            .logout();
    }

    _onActive = this._onActive.bind(this);
    _onActive(tab) {
        this.transitionTo(tab.props.route);
    }

    render() {
        const styles = this._getStyles();
        return (
            <header className="app--header">
                <div className="wrap">
                    <div className="row center-xs">
                        <Link to="login" style={styles.link} onClick={this._handleLogout}>Logout</Link>
                    </div>
                    <div className="row">
                        <Tabs tabItemContainerStyle={styles.tabs}>
                            <Tab style={styles.tab} label={ t('FEED') } route="feed" onActive={this._onActive} />
                            <Tab style={styles.tab} label={ t('COMPANY') } route="company" onActive={this._onActive} />
                        </Tabs>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
