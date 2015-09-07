import React, { PropTypes } from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
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

class IconContainer extends StyleableComponent {

    static propTypes = {
        IconClass: PropTypes.func.isRequired,
        iconStyle: PropTypes.object,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        style: PropTypes.object,
    }

    render() {
        const {
            iconStyle,
            stroke,
            strokeWidth,
            style,
            ...other,
        } = this.props;
        return (
            <div {...other} style={this.mergeAndPrefix(styles.root, style)}>
                <this.props.IconClass
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={this.mergeAndPrefix(styles.icon, iconStyle)}
                />
            </div>
        );
    }

}

export default IconContainer;
