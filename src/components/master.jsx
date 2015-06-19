'use strict';

import * as mui from 'material-ui';
import React from 'react';
import {RouteHandler} from 'react-router';

const {AppCanvas, FullWidthSection} = mui;
const ThemeManager = new mui.Styles.ThemeManager();


class Master extends React.Component {

    static get childContextTypes() {
        return {
            muiTheme: React.PropTypes.object,
        };
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    render() {
        return (
            <AppCanvas>
                <RouteHandler />
          </AppCanvas>
        );
    }
}

export default Master;
