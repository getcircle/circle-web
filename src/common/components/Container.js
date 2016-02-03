import React, { PropTypes } from 'react';

import { backgroundColors } from '../constants/styles';

import CSSComponent from './CSSComponent';

class Container extends CSSComponent {

    static propTypes = {
        children: PropTypes.node,
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                root: {
                    minHeight: '100vh',
                    paddingBottom: 100,
                    ...backgroundColors.light,
                },
            },
        };
    }

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <section {...other} style={{...this.styles().root, ...style}}>
                {this.props.children}
            </section>
        );
    }

}

export default Container;
