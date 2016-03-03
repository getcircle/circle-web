import React, { PropTypes } from 'react';
import keymirror from 'keymirror';
import { services } from 'protobufs';

import Colors from '../../styles/Colors';
import t from '../../utils/gettext';

import TrashIconV2 from '../TrashIconV2';
import HoverIconMenu from '../HoverIconMenu';
import MenuItem from '../MenuItem';

export const MENU_CHOICES = keymirror({
    REMOVE: null,
});

const ItemMenu = ({ hover, item, onMenuChoice, style }) => {
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
};

ItemMenu.propTypes = {
    hover: PropTypes.bool,
    item: PropTypes.instanceOf(services.post.containers.CollectionItemV1),
    onMenuChoice: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default ItemMenu;
