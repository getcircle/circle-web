'use strict';

import * as mui from 'material-ui';
import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react';

const { AppCanvas, FullWidthSection } = mui;
const ThemeManager = new mui.Styles.ThemeManager();

@decorate(Navigation)
class App extends React.Component {

    static get childContextTypes() {
        return {
            muiTheme: React.PropTypes.object,
        };
    }

    _defaultRoute() {
        this.replaceWith('feed');
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

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    render() {
        return (
            <AppCanvas>
                {this.props.children}
            </AppCanvas>
        );
    }
}

export default App;
