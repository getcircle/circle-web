'use strict';

import React from 'react';

import ThemeManager from '../utils/ThemeManager';

class BasePage extends React.Component {

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

}

export default BasePage;
