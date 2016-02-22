import React, { Component, PropTypes } from 'react';
import { MenuItem as MaterialMenuItem } from 'material-ui';

class MenuItem extends Component {

    render() {
        const { desktop, onTouchTap, text, ...other } = this.props;
        return (
            <MaterialMenuItem
                desktop={true}
                onTouchTap={onTouchTap}
                primaryText={text}
                {...other}
            />
        );
    }

};

MenuItem.propTypes = {
    desktop: PropTypes.bool,
    onTouchTap: PropTypes.func,
    text: PropTypes.string.isRequired,
}

export default MenuItem;

