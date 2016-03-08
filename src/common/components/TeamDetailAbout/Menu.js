import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { showConfirmDeleteModal } from '../../actions/teams';
import { EDIT_TEAM } from '../../constants/forms';
import { showFormDialog } from '../../actions/forms';
import t from '../../utils/gettext';

import EditIcon from '../EditIcon';
import IconMenu from '../IconMenu';
import MenuItem from '../MenuItem';

const Menu = ({ team }, { store: { dispatch }, muiTheme }) => {
    const icon = (
        <EditIcon stroke={muiTheme.luno.tintColor} />
    );

    function handleEditTeam() { dispatch(showFormDialog(EDIT_TEAM)) };
    function handleDeleteTeam() { dispatch(showConfirmDeleteModal(team)) };

    const menuItems = [];
    if (team.permissions && team.permissions.can_edit) {
        menuItems.push(
            <MenuItem
                key={'team-menu-edit'}
                onTouchTap={handleEditTeam}
                text={t('Edit Team')}
            />
        );
    }

    if (team.permissions && team.permissions.can_delete) {
        menuItems.push(
            <MenuItem
                key={'team-menu-delete'}
                onTouchTap={handleDeleteTeam}
                text={t('Delete Team')}
            />
        );
    }

    if (menuItems.length > 0) {
        return (
            <IconMenu iconElement={icon}>
                {menuItems}
            </IconMenu>
        );
    } else {
        return <span />;
    }
};

Menu.propTypes = {
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
};

Menu.contextTypes = {
    muiTheme: PropTypes.object,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
}

export default Menu;
