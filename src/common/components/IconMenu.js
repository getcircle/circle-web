import { IconButton, IconMenu as MaterialIconMenu } from 'material-ui';
import merge from 'merge';
import React, { PropTypes } from 'react';

const IconMenu = (props) => {
    const {
        children,
        iconElement,
        menuStyle,
        onRequestChange,
        open,
        style,
    } = props;
    const styles = {
        button: {
            left: 6,
            position: 'absolute',
            top: 6,
        },
        menu: {},
        root: {},
    };
    const button = <IconButton>{iconElement}</IconButton>;
    return (
        <MaterialIconMenu
            anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
            iconButtonElement={button}
            menuStyle={merge(styles.menu, menuStyle)}
            onRequestChange={onRequestChange}
            open={open}
            style={merge(styles.root, style)}
            targetOrigin={{horizontal: 'middle', vertical: 'top'}}
        >
            {children}
        </MaterialIconMenu>
    );
};

IconMenu.propTypes = {
    children: PropTypes.node,
    hover: PropTypes.bool,
    iconElement: PropTypes.object.isRequired,
    menuStyle: PropTypes.object,
    onRequestChange: PropTypes.func,
    open: PropTypes.bool,
    style: PropTypes.object,
};

IconMenu.defaultProps = {
    menuStyle: {},
    style: {},
};

export default IconMenu;
