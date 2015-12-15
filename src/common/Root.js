import React, { Component, PropTypes } from 'react';

import CSSMixins from './CSSMixins';
import InternalPropTypes from './components/InternalPropTypes';
import CurrentTheme from './utils/ThemeManager';

// import styles so webpack includes them
import './styles/app.scss';

export default class Root extends Component {

    static propTypes = {
        url: InternalPropTypes.URLContext.isRequired,
    }

    static childContextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object,
        url: InternalPropTypes.URLContext.isRequired,
    }

    getChildContext() {
        return {
            mixins: CSSMixins,
            muiTheme: CurrentTheme,
            url: this.props.url,
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

