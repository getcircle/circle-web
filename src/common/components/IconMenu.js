import { IconButton, IconMenu as MaterialIconMenu } from 'material-ui';
import { merge } from 'lodash';
import React, { PropTypes } from 'react';

const IconMenu = (props) => {
    const {
        children,
        iconElement,
        iconButtonStyle,
        iconButtonElement,
        menuStyle,
        style,
        touchTapCloseDelay,
        ...other,
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

    let button;
    if (iconButtonElement) {
        button = iconButtonElement;
    } else {
        button = (
            <IconButton style={iconButtonStyle}>
                {iconElement}
            </IconButton>
        );
    }

    return (
        <MaterialIconMenu
            anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
            iconButtonElement={button}
            menuStyle={merge(styles.menu, menuStyle)}
            style={merge(styles.root, style)}
            targetOrigin={{horizontal: 'middle', vertical: 'top'}}
            touchTapCloseDelay={touchTapCloseDelay}
            {...other}
        >
            {children}
        </MaterialIconMenu>
    );
};

IconMenu.propTypes = {
    children: PropTypes.node,
    iconButtonElement: PropTypes.node,
    iconButtonStyle: PropTypes.object,
    iconElement: PropTypes.node,
    menuStyle: PropTypes.object,
    open: PropTypes.bool,
    style: PropTypes.object,
    touchTapCloseDelay: PropTypes.number,
};

IconMenu.defaultProps = {
    menuStyle: {},
    style: {},
    touchTapCloseDelay: 0,
};

export default IconMenu;
