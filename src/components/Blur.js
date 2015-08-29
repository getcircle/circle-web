import React, { PropTypes } from 'react';
import { default as ReactBlur } from 'react-blur';

import CSSComponent from './CSSComponent';

class Blur extends CSSComponent {

    static propTypes = {
        img: PropTypes.string,
        style: PropTypes.object,
    }

    classes() {
        return {
            'default': {
                root: {
                    Absolute: '0',
                    zIndex: -1,
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
        if (this.props.img) {
            return (
                <ReactBlur {...this.props} />
            );
        } else {
            return (
                <div>
                    <div {...other} style={{...this.styles().root, ...style}} />
                    {children}
                </div>
            );
        }

    }
}

export default Blur;
