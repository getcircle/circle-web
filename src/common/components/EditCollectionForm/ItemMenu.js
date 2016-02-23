import React, { PropTypes } from 'react';
import keymirror from 'keymirror';
import { services } from 'protobufs';

import t from '../../utils/gettext';

import EditIcon from '../EditIcon';
import HoverIconMenu from '../HoverMoreMenu';
import MenuItem from '../MenuItem';

export const MENU_CHOICES = keymirror({
    REMOVE: null,
});

const ItemMenu = ({ hover, onMenuChoice, item }) => {
    function removeItem() { onMenuChoice(MENU_CHOICES.REMOVE, item); }
    const icon = <EditIcon />;
    return (
        <HoverIconMenu
            hover={hover}
            iconElement={icon}
            style={styles.root}
        >
            <MenuItem onTouchTap={removeItem} text={t('Remove from this Collection')} />
        </HoverIconMenu>
    );
};

ItemMenu.propTypes = {
    hover: PropTypes.bool,
    item: PropTypes.instanceOf(services.post.containers.CollectionItemV1),
    onMenuChoice: PropTypes.func.isRequired,
};

export default ItemMenu;
