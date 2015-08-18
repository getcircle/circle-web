import React, { Component } from 'react';
import mui from 'material-ui';

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

class IconContainer extends Component {

    static propTypes = {
        IconClass: React.PropTypes.func.isRequired,
        stroke: React.PropTypes.string,
    }

    render() {
        const {
            stroke,
            ...other,
        } = this.props;
        return (
            <div {...other} style={styles.root}>
                <this.props.IconClass style={styles.icon} stroke={stroke}/>
            </div>
        );
    }

}

export default IconContainer;
