import React from 'react';

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
        IconClass: React.PropTypes.func.isRequired,
        stroke: React.PropTypes.string,
        strokeWidth: React.PropTypes.number,
        iconStyle: React.PropTypes.object,
    }

    render() {
        const {
            iconStyle,
            style,
            stroke,
            strokeWidth,
            ...other,
        } = this.props;
        return (
            <div {...other} style={this.mergeAndPrefix(styles.root, style)}>
                <this.props.IconClass
                    style={this.mergeAndPrefix(styles.icon, iconStyle)}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                />
            </div>
        );
    }

}

export default IconContainer;
