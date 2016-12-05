import React, { PropTypes } from 'react';

import HoverIconMenu from './HoverIconMenu';
import MoreIcon from './MoreIcon';

const HoverMoreMenu = ({children, hover}, {muiTheme}) => {
    const { tintColor } = muiTheme.luno;
    const styles = {
        button: {
            left: 6,
            position: 'absolute',
            top: 6,
        },
        circle: {
            border: `2px solid ${tintColor}`,
            borderRadius: '50%',
            left: 12,
            height: 24,
            position: 'absolute',
            top: 12,
            width: 24,
        },
        root: {
            position: 'absolute',
            right: 18,
            top: 15,
        },
    };
    const icon = (
        <div>
            <MoreIcon
                height={36}
                stroke={tintColor}
                style={styles.button}
                width={36}
            />
            <div style={styles.circle} />
        </div>
    );
    return (
        <HoverIconMenu
            hover={hover}
            iconElement={icon}
            style={styles.root}
        >
            {children}
        </HoverIconMenu>
    );
};
HoverMoreMenu.propTypes = {
    children: PropTypes.node,
    hover: PropTypes.bool,
};
HoverMoreMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default HoverMoreMenu;
