import React, { Component, PropTypes } from 'react';

import CSSMixins from './CSSMixins';
import CurrentTheme from './utils/ThemeManager';

// import styles so webpack includes them
import './styles/app.scss';

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

