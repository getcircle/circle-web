import React, { PropTypes } from 'react';

import IconMenu from './IconMenu';
import ShareIcon from './ShareIconV2';

const CircularShareMenu = (props, { muiTheme }) => {
    const theme = muiTheme.luno.circularIconMenu;
    return (
        <IconMenu
            iconButtonStyle={theme.button}
            iconElement={<ShareIcon {...theme.Icon} />}
            style={theme.menu}
            {...props}
        />
    );
};

CircularShareMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default CircularShareMenu;
