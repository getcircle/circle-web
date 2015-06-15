import * as mui from 'material-ui';
import React from 'react';
import {RouteHandler} from 'react-router';

import t from '../utils/gettext';

const {AppCanvas, FullWidthSection} = mui;
const Colors = mui.Styles.Colors;
const ThemeManager = new mui.Styles.ThemeManager();


class Master extends React.Component {

    static get childContextTypes() {
        return {
            muiTheme: React.PropTypes.object
        };
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        }
    }

    getStyles() {
        var darkWhite = Colors.darkWhite;
        return {
            footer: {
                backgroundColor: Colors.grey900,
                textAlign: 'center'
            },
            p: {
                margin: '0 auto',
                padding: '0',
                color: Colors.lightWhite,
                maxWidth: '335px'
            },
        };
    }

    render() {
        let styles = this.getStyles();
        return (
            <AppCanvas>
                <RouteHandler />
          </AppCanvas>
        )
    }
};

export default Master;
