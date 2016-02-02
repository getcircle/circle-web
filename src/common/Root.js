import React, { Component, PropTypes } from 'react';

import getCSSMixins from './getCSSMixins';
import InternalPropTypes from './components/InternalPropTypes';
import { getCustomTheme } from './styles/theme';

// import styles so webpack includes them
import './styles/app.scss';

export default class Root extends Component {

    static propTypes = {
        url: InternalPropTypes.URLContext.isRequired,
        userAgent: PropTypes.string.isRequired,
    }

    static childContextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object,
        url: InternalPropTypes.URLContext.isRequired,
    }

    getChildContext() {
        return {
            mixins: getCSSMixins(this.props.userAgent),
            muiTheme: getCustomTheme(this.props.userAgent),
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

