import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/lib/menus/menu-item';

import { IconButton } from 'material-ui';

import { showAddMembersModal } from '../actions/teams';
import t from '../utils/gettext';

import InternalPropTypes from './InternalPropTypes';

import DetailSection from './DetailSectionV2';
import InfiniteProfilesGrid from './InfiniteProfilesGrid';
import PlusIcon from './PlusIcon';
import MoreMenu from './MoreMenu';
import ProfilesGrid from './ProfilesGrid';
import TeamAddMembersForm from './TeamAddMembersForm';

const TeamCoordinatorMenu = ({hover}) => {
    return (
        <MoreMenu
            hover={hover}
        >
            <MenuItem primaryText="Make Member" />
            <MenuItem primaryText="Remove" />
        </MoreMenu>
    );
};
TeamCoordinatorMenu.propTypes = {
    dispatch: PropTypes.func.isRequired,
    hover: PropTypes.bool,
    profile: InternalPropTypes.ProfileV1.isRequired,
};

const TeamMemberMenu = ({hover}) => {
    return (
        <MoreMenu
            hover={hover}
        >
            <MenuItem primaryText="Make Coordinator" />
            <MenuItem primaryText="Remove" />
        </MoreMenu>
    );
};
TeamMemberMenu.propTypes = {
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
                    MenuComponent={TeamMemberMenu}
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
