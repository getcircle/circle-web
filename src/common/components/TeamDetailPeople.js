import { IconButton } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';
import { removeMembers, updateMembers } from '../actions/teams';
import { ADD_MEMBERS } from '../constants/forms';
import { showFormDialog } from '../actions/forms';

import DetailSection from './DetailSectionV2';
import HoverMoreMenu from './HoverMoreMenu';
import InfiniteProfilesGrid from './InfiniteProfilesGrid';
import InternalPropTypes from './InternalPropTypes';
import MenuItem from './MenuItem';
import PersonIcon from './PersonIcon';
import PlusIcon from './PlusIcon';
import ProfilesGrid from './ProfilesGrid';
import TeamAddMembersForm from './TeamAddMembersForm';

const menuChoices = {
    MAKE_COORDINATOR: 'MAKE_COORDINATOR',
    MAKE_MEMBER: 'MAKE_MEMBER',
    REMOVE: 'REMOVE',
};

const TeamCoordinatorMenu = ({ hover, onMenuChoice, profile }) => {
    function makeMember() { onMenuChoice(menuChoices.MAKE_MEMBER, profile); }
    function remove() { onMenuChoice(menuChoices.REMOVE, profile); }
    return (
        <HoverMoreMenu
            hover={hover}
        >
            <MenuItem onTouchTap={makeMember} text={t('Make Member')} />
            <MenuItem onTouchTap={remove} text={t('Remove')} />
        </HoverMoreMenu>
    );
};
TeamCoordinatorMenu.propTypes = {
    hover: PropTypes.bool,
    onMenuChoice: PropTypes.func.isRequired,
    profile: InternalPropTypes.ProfileV1.isRequired,
};

const TeamMemberMenu = ({ hover, onMenuChoice, profile }) => {
    function makeCoordinator() { onMenuChoice(menuChoices.MAKE_COORDINATOR, profile); }
    function remove() { onMenuChoice(menuChoices.REMOVE, profile); }
    return (
        <HoverMoreMenu
            hover={hover}
        >
            <MenuItem onTouchTap={makeCoordinator} text={t('Make Coordinator')} />
            <MenuItem onTouchTap={remove} text={t('Remove')} />
        </HoverMoreMenu>
    );
};
TeamMemberMenu.propTypes = {
    hover: PropTypes.bool,
    onMenuChoice: PropTypes.func.isRequired,
    profile: InternalPropTypes.ProfileV1.isRequired,
};

const TeamDetailPeople = (props, { device, muiTheme }) => {
    const {
        coordinators,
        dispatch,
        hasMoreMembers,
        members,
        membersLoading,
        onLoadMoreMembers,
        team,
    } = props;
    const theme = muiTheme.luno.detail;
    const canEdit = team.permissions && team.permissions.can_edit;

    const handleMenuChoice = (choice, profile) => {
        const allMembers = coordinators.concat(members);
        const member = allMembers.find(m => m.profile.id === profile.id);
        switch(choice) {
        case menuChoices.MAKE_MEMBER:
            member.role = services.team.containers.TeamMemberV1.RoleV1.MEMBER;
            dispatch(updateMembers(team.id, [member]));
            break;
        case menuChoices.MAKE_COORDINATOR:
            member.role = services.team.containers.TeamMemberV1.RoleV1.COORDINATOR;
            dispatch(updateMembers(team.id, [member]));
            break;
        case menuChoices.REMOVE:
            dispatch(removeMembers(team.id, [member]));
            break;
        }
    };

    let coordinatorsSection;
    if (coordinators && coordinators.length) {
        const coordinatorProfiles = coordinators.map(c => c.profile);
        const MenuComponent = canEdit && coordinators.length > 1 ? TeamCoordinatorMenu : null;
        coordinatorsSection = (
            <DetailSection dividerStyle={{marginBottom: 0}} title={t('Coordinators')}>
                <ProfilesGrid
                    MenuComponent={MenuComponent}
                    onMenuChoice={handleMenuChoice}
                    profiles={coordinatorProfiles}
                />
            </DetailSection>
        );
    }

    let plusIcon;
    if (canEdit) {
        const styles = {
            icon: {
                border: '1px solid',
                borderColor: muiTheme.luno.tintColor,
                borderRadius: '25px',
            },
        };
        const handleTouchTap = () => dispatch(showFormDialog(ADD_MEMBERS));
        plusIcon = (
            <IconButton iconStyle={styles.icon} onTouchTap={handleTouchTap}>
                <PlusIcon stroke={muiTheme.luno.tintColor} />
            </IconButton>
        );
    }

    let membersSection;
    const teamPeopleCountString = team.total_members ? ` (${team.total_members})` : '';
    if (members && members.length) {
        const memberProfiles = members.map(m => m.profile);
        const MenuComponent = canEdit ? TeamMemberMenu : null;
        membersSection = (
            <DetailSection
                dividerStyle={{marginBottom: 0}}
                key="members-section"
                title={t('Members')}
            >
                <InfiniteProfilesGrid
                    MenuComponent={MenuComponent}
                    hasMore={hasMoreMembers}
                    loading={membersLoading}
                    onLoadMore={onLoadMoreMembers}
                    onMenuChoice={handleMenuChoice}
                    profiles={memberProfiles}
                />
            </DetailSection>
        );
    }

    return (
        <div>
            <section className="row middle-xs">
                <PersonIcon />
                <h1 style={theme.h1}>{t('People')}{teamPeopleCountString}</h1>
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
    hasMoreMembers: PropTypes.bool.isRequired,
    members: PropTypes.array,
    membersLoading: PropTypes.bool,
    onLoadMoreMembers: PropTypes.func,
    team: InternalPropTypes.TeamV1.isRequired,
};

TeamDetailPeople.contextTypes = {
    device: InternalPropTypes.DeviceContext,
    muiTheme: PropTypes.object.isRequired,
};

export default TeamDetailPeople;
