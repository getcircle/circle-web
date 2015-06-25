'use strict';

import connectToStores from 'alt/utils/connectToStores';
import { Link } from 'react-router';
import React from 'react';

@connectToStores
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
                display: 'block',
                marginTop: 10,
            },
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.flux.getStore('AuthStore').isLoggedIn()) {
            this.context.router.transitionTo('login');
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

    render() {
        const styles = this._getStyles();
        return (
            <header className='app--header'>
                <Link to='company' style={styles.link}>Company</Link>
                <Link to='feed' style={styles.link}>Feed</Link>
                <Link to='login' style={styles.link} onClick={this._handleLogout}>Logout</Link>
            </header>
        );
    }
}

export default Header;
