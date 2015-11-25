import React, { Component, PropTypes } from 'react';

import CSSMixins from './CSSMixins';
import CurrentTheme from './utils/ThemeManager';

export default class Root extends Component {

    static childContextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object,
    }

    getChildContext() {
        return {
            mixins: CSSMixins,
            muiTheme: CurrentTheme,
        };
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    };
}

