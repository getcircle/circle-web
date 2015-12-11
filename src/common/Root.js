import React, { Component, PropTypes } from 'react';

import CSSMixins from './CSSMixins';
import CurrentTheme from './utils/ThemeManager';

// import styles so webpack includes them
import './styles/app.scss';

export default class Root extends Component {

    static propTypes = {
        subdomain: PropTypes.string.isRequired,
    }

    static childContextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object,
        subdomain: PropTypes.string.isRequired,
    }

    getChildContext() {
        return {
            mixins: CSSMixins,
            muiTheme: CurrentTheme,
            subdomain: this.props.subdomain,
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

