import { merge } from 'lodash';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import IconMenu from './IconMenu';
import MoreIcon from './MoreIcon';

const MoreMenu = ({ style, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.circularIconMenu;
    const menuStyle = merge({}, theme.menu, style);
    return (
        <IconMenu
            iconButtonStyle={theme.button}
            iconElement={<MoreIcon {...theme.Icon} />}
            style={menuStyle}
            tooltip={t('More Actions')}
            {...other}
        />
    );
};

MoreMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default MoreMenu;
