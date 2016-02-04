import _ from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { PAGE_TYPE } from '../constants/trackerProperties';
import { routeToProfile, routeToTeam } from '../utils/routes';
import t from '../utils/gettext';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import DetailMembers from './DetailMembers';
import InternalPropTypes from './InternalPropTypes';
import ProfileAvatar from './ProfileAvatar';
import TeamDetailDescription from './TeamDetailDescription';
import TeamDetailForm from './TeamDetailForm';
import TeamDetailHeader from './TeamDetailHeader';
import TeamDetailTeams from './TeamDetailTeams';

const { DescriptionV1 } = services.common.containers.description;

class DeprecatedTeamDetail extends CSSComponent {

    static propTypes = {
        extendedTeam: PropTypes.shape({
            reportingDetails: PropTypes.object.isRequired,
            team: PropTypes.object.isRequired,
        }),
        members: PropTypes.arrayOf(services.profile.containers.ProfileV1),
        membersLoadMore: PropTypes.func,
        onUpdateTeamCallback: PropTypes.func.isRequired,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    classes() {
        return {
            default: {
                description: {
                    padding: 20,
                    lineHeight: '24px',
                    fontSize: '14px',
                },
                section: {
                    marginTop: 20,
                },
            },
        };
    }

    // Update Methods

    onUpdateDescription(descriptionText) {
        const {
            extendedTeam,
            onUpdateTeamCallback,
        } = this.props;

        let teamDescriptionV1 = new DescriptionV1({
            value: descriptionText,
        });

        let updatedTeam = Object.assign({}, extendedTeam.team, {
            description: teamDescriptionV1,
        });

        onUpdateTeamCallback(updatedTeam);
    }

    editButtonTapped() {
        if (this.refs.teamDetailForm) {
            this.refs.teamDetailForm.show();
        }
    }

    canEdit() {
        let team = this.props.extendedTeam.team;
        let canEdit = team.permissions ? team.permissions.can_edit : false;
        return canEdit;
    }

    // Render Methods

    renderDescription(manager, team) {
        return (
            <TeamDetailDescription
                description={team.description}
                isEditable={this.canEdit()}
                manager={manager}
                onEditTapped={this.editButtonTapped.bind(this)}
                onSaveCallback={this.onUpdateDescription.bind(this)}
                style={this.styles().section}
                team={team}
            />
        );
    }

    renderManager(manager) {
        return (
            <Card style={this.styles().section} title="Manager">
                <CardRow>
                    <CardList>
                        <CardListItem
                            leftAvatar={<ProfileAvatar profile={manager} />}
                            onTouchTap={routeToProfile.bind(null, this.context.history, manager)}
                            primaryText={manager.full_name}
                            secondaryText={manager.title}
                        />
                    </CardList>
                </CardRow>
            </Card>
        );
    }

    renderChildTeams(childTeams, totalTeamsCount) {
        if (childTeams && childTeams.length) {
            return (
                <TeamDetailTeams
                    onClickTeam={routeToTeam.bind(null, this.context.history)}
                    style={this.styles().section}
                    teams={childTeams}
                    totalTeamsCount={totalTeamsCount}
                />
            );
        }
    }

    renderTeamMembers(manager, members, totalMembersCount) {
        if (members && members.length) {
            members = _.filter(members, (profile) => profile.id !== manager.id);

            // Subtract one for manager
            let membersCount = totalMembersCount - 1;
            let title = `${t('People')} (${membersCount})`;
            let actionText = '';
            if (totalMembersCount === 1) {
                actionText = 'View 1 Person';
            } else {
                actionText = `View all ${membersCount} People`;
            }

            return (
                <DetailMembers
                    actionText={actionText}
                    members={members}
                    membersLoadMore={this.props.membersLoadMore}
                    onClickMember={routeToProfile.bind(null, this.context.history)}
                    pageType={PAGE_TYPE.TEAM_MEMBERS}
                    style={this.styles().section}
                    title={title}
                    viewAllAttribute={services.search.containers.search.AttributeV1.TEAM_ID}
                    viewAllAttributeValue={this.props.extendedTeam.team.id}
                    viewAllFilterPlaceholderText="Search People"
                    viewAllTitle={`People (${membersCount})`}
                />
            );
        }
    }

    renderTeamDetailForm(team, isManager) {
        const {
            onUpdateTeamCallback,
        } = this.props;

        if (this.canEdit()) {
            return (
                <TeamDetailForm
                    isManager={isManager}
                    onSaveCallback={onUpdateTeamCallback}
                    ref="teamDetailForm"
                    team={team}
                />
            );
        }
    }

    render() {
        const { extendedTeam, members } = this.props;
        const { team, reportingDetails } = extendedTeam;
        const { manager } = reportingDetails;
        const { profile } = this.context.auth;
        const childTeams = reportingDetails.child_teams;

        return (
            <div>
                <TeamDetailHeader
                    isEditable={this.canEdit()}
                    onEditTapped={this.editButtonTapped.bind(this)}
                    team={team}
                />
                <DetailContent>
                    {this.renderDescription(manager, team)}
                    {this.renderManager(manager)}
                    {this.renderChildTeams(childTeams, team.child_team_count)}
                    {this.renderTeamMembers(manager, members, team.profile_count)}
                </DetailContent>
                {this.renderTeamDetailForm(team, profile.id === manager.id)}
            </div>
        );
    }

}

export default DeprecatedTeamDetail;
