import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class Blur extends CSSComponent {

    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        img: PropTypes.string,
        style: PropTypes.object,
    }

    classes() {
        return {
            'default': {
                root: {
                    Absolute: '0',
                },
            },
        };
    }

    render() {
        const {
            children,
            style,
            ...other,
        } = this.props;
        return (
            <div>
                <div {...other} style={{...this.styles().root, ...style}} />
                {children}
            </div>
        );
    }
}

export default Blur;
