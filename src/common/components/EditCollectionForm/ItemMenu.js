import React, { Component, PropTypes } from 'react';
import keymirror from 'keymirror';
import { services } from 'protobufs';
import { merge } from 'lodash';

import Colors from '../../styles/Colors';
import t from '../../utils/gettext';

import TrashIconV2 from '../TrashIconV2';
import HoverIconMenu from '../HoverIconMenu';
import MenuItem from '../MenuItem';

export const MENU_CHOICES = keymirror({
    REMOVE: null,
});

class ItemMenu extends Component {

    state = {
        muiTheme: this.context.muiTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        const muiTheme = merge({}, this.state.muiTheme);
        muiTheme.zIndex.popover = 3100;
        this.setState({muiTheme});
    }

    render() {
        const { hover, item, onMenuChoice, style } = this.props;
        function removeItem() { onMenuChoice(MENU_CHOICES.REMOVE, item); }
        const icon = <TrashIconV2 height={28} stroke={Colors.lightRed} width={28} />;
        return (
            <HoverIconMenu
                hover={hover}
                iconElement={icon}
                style={style}
            >
                <MenuItem onTouchTap={removeItem} text={t('Remove from this Collection')} />
            </HoverIconMenu>
        );
    }
}


ItemMenu.propTypes = {
    hover: PropTypes.bool,
    item: PropTypes.object.isRequired,
    onMenuChoice: PropTypes.func.isRequired,
    style: PropTypes.object,
};

ItemMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

ItemMenu.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default ItemMenu;
