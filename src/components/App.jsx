'use strict';

import mui from 'material-ui';
import { assign } from 'lodash';
import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react';

import Header from './Header';
import ThemeManager from '../utils/ThemeManager';

const { AppCanvas } = mui;

@decorate(Navigation)
class App extends React.Component {

    _defaultRoute() {
        this.replaceWith('feed');
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        if (!this.props.children) {
            this._defaultRoute();
        }
    }

    shouldComponentUpdate() {
        if (!this.props.children) {
            this._defaultRoute();
            return false;
        }
        return true;
    }

    render() {
        const props: Object = assign({}, this.state, this.props);
        let header;
        if (this.props.flux.getStore('AuthStore').isLoggedIn()) {
            header = <Header {...props} />;
        }
        return (
            <AppCanvas>
                {header}
                {this.props.children}
            </AppCanvas>
        );
    }
}

export default App;
