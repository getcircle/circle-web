import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class IconContainer extends CSSComponent {

    // rootStyle and style serve the same purpose
    // but style does not work with ReactCSS spread operator
    // It is reatined here for backwards compatibility
    static propTypes = {
        IconClass: PropTypes.func.isRequired,
        iconStyle: PropTypes.object,
        rootStyle: PropTypes.object,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                icon: {
                    width: 40,
                    height: 40,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    margin: 'auto',
                },
                root: {
                    width: 60,
                    height: 60,
                    border: '1px solid rgba(0, 0, 0, .1)',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: 16,
                    left: 16,
                },
            }
        };
    }

    render() {
        const {
            iconStyle,
            rootStyle,
            stroke,
            strokeWidth,
            style,
            ...other,
        } = this.props;

        return (
            <div {...other} style={{...this.styles().root, ...rootStyle, ...style}}>
                <this.props.IconClass
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={{...this.styles().icon, ...iconStyle}}
                />
            </div>
        );
    }
}

export default IconContainer;
