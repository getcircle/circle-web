import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import { IconButton } from 'material-ui';

import { showAddMembersModal } from '../actions/teams';
import t from '../utils/gettext';

import InternalPropTypes from './InternalPropTypes';

import DetailSection from './DetailSectionV2';
import InfiniteProfilesGrid from './InfiniteProfilesGrid';
import PlusIcon from './PlusIcon';
import ProfilesGrid from './ProfilesGrid';
import TeamAddMembersForm from './TeamAddMembersForm';

class TeamCoordinatorMenu extends Component {

    state = {
        open: false,
    }

    handleRequestChange = (open) => {
        this.setState({open: open});
    }

    render() {
        const { hover } = this.props;
        const { open } = this.state;
        const styles = {
            root: {
                position: 'absolute',
                right: 5,
                top: 16,
            },
            menu: {},
        };
        if (!hover && !open) {
            styles.root.display = 'none';
            styles.menu.display = 'none';
        }
        return (
            <IconMenu
                anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                menuStyle={styles.menu}
                onRequestChange={this.handleRequestChange}
                open={this.state.open}
                style={styles.root}
                targetOrigin={{horizontal: 'middle', vertical: 'top'}}
            >
                <MenuItem primaryText="Make Member" />
                <MenuItem primaryText="Remove" />
            </IconMenu>
        );
    }
};

TeamCoordinatorMenu.propTypes = {
    dispatch: PropTypes.func.isRequired,
    hover: PropTypes.bool,
    profile: InternalPropTypes.ProfileV1.isRequired,
};

const TeamDetailPeople = (props, { device, muiTheme }) => {
    const {
        coordinators,
        dispatch,
        members,
        membersLoading,
        onLoadMoreMembers,
        team,
    } = props;
    const theme = muiTheme.luno.detail;

    let coordinatorsSection;
    if (coordinators && coordinators.length) {
        const coordinatorProfiles = coordinators.map(c => c.profile);
        coordinatorsSection = (
            <DetailSection dividerStyle={{marginBottom: 0}} title={t('Coordinators')}>
                <ProfilesGrid
                    MenuComponent={TeamCoordinatorMenu}
                    dispatch={dispatch}
                    profiles={coordinatorProfiles}
                />
            </DetailSection>
        );
    }

    let plusIcon;
    if (team.permissions && team.permissions.can_edit) {
        const styles = {
            icon: {
                border: '1px solid',
                borderColor: muiTheme.luno.tintColor,
                borderRadius: '25px',
            },
        };
        const handleTouchTap = () => dispatch(showAddMembersModal());
        plusIcon = (
            <IconButton iconStyle={styles.icon} onTouchTap={handleTouchTap}>
                <PlusIcon stroke={muiTheme.luno.tintColor} />
            </IconButton>
        );
    }

    let membersSection;
    if (members && members.length) {
        const memberProfiles = members.map(m => m.profile);
        membersSection = (
            <DetailSection
                dividerStyle={{marginBottom: 0}}
                key="members-section"
                title={t('Members')}
            >
                <InfiniteProfilesGrid
                    dispatch={dispatch}
                    loading={membersLoading}
                    onLoadMore={onLoadMoreMembers}
                    profiles={memberProfiles}
                />
            </DetailSection>
        );
    }

    return (
        <div>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t('People')}</h1>
                {plusIcon}
            </section>
            {coordinatorsSection}
            {membersSection}
            <TeamAddMembersForm team={team} />
        </div>
    );
};

TeamDetailPeople.propTypes = {
    coordinators: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    members: PropTypes.array,
    membersLoading: PropTypes.bool,
    onLoadMoreMembers: PropTypes.func,
    team: PropTypes.instanceOf(services.team.containers.TeamV1),
};

TeamDetailPeople.contextTypes = {
    device: InternalPropTypes.DeviceContext,
    muiTheme: PropTypes.object.isRequired,
};

export default TeamDetailPeople;
