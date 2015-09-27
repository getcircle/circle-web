import _ from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { PAGE_TYPE } from '../constants/trackerProperties';
import { routeToProfile, routeToTeam } from '../utils/routes';
import resizable from '../decorators/resizable';
import t from '../utils/gettext';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import DetailMembers from './DetailMembers';
import ProfileAvatar from './ProfileAvatar';
import TeamDetailDescription from './TeamDetailDescription';
import TeamDetailHeader from './TeamDetailHeader';
import TeamDetailStatus from './TeamDetailStatus';
import TeamDetailTeams from './TeamDetailTeams';

const { DescriptionV1 } = services.common.containers;
const { TeamStatusV1 } = services.organization.containers;

@resizable
class TeamDetail extends CSSComponent {

    static propTypes = {
        extendedTeam: PropTypes.shape({
            reportingDetails: PropTypes.object.isRequired,
            team: PropTypes.object.isRequired,
        }),
        largerDevice: PropTypes.bool.isRequired,
        members: PropTypes.arrayOf(services.profile.containers.ProfileV1),
        membersLoadMore: PropTypes.func,
        onUpdateTeamCallback: PropTypes.func.isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
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

    onUpdateStatus(statusText) {
        const {
            extendedTeam,
            onUpdateTeamCallback,
        } = this.props;

        let teamStatusV1 = new TeamStatusV1({
            value: statusText,
        });

        let updatedTeam = Object.assign({}, extendedTeam.team, {
            status:  teamStatusV1,
        });

        onUpdateTeamCallback(updatedTeam);
    }

    // Render Methods

    renderStatus(status, isEditable) {
        return (
            <TeamDetailStatus
                is="section"
                isEditable={isEditable}
                onSaveCallback={this.onUpdateStatus.bind(this)}
                status={status}
            />
        );
    }

    renderDescription(team, isEditable) {
        return (
            <TeamDetailDescription
                description={team.description}
                is="section"
                isEditable={isEditable}
                onSaveCallback={this.onUpdateDescription.bind(this)}
            />
        );
    }

    renderManager(manager) {
        return (
            <Card is="section" title="Manager">
                <CardRow>
                    <CardList>
                        <CardListItem
                            leftAvatar={<ProfileAvatar profile={manager} />}
                            onTouchTap={routeToProfile.bind(null, this.context.router, manager)}
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
                    is="section"
                    largerDevice={this.props.largerDevice}
                    onClickTeam={routeToTeam.bind(null, this.context.router)}
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
                    is="section"
                    largerDevice={this.props.largerDevice}
                    members={members}
                    membersLoadMore={this.props.membersLoadMore}
                    onClickMember={routeToProfile.bind(null, this.context.router)}
                    pageType={PAGE_TYPE.TEAM_MEMBERS}
                    title={title}
                    viewAllAttribute={services.search.containers.search.AttributeV1.TEAM_ID}
                    viewAllAttributeValue={this.props.extendedTeam.team.id}
                    viewAllFilterPlaceholderText="Search People"
                    viewAllTitle={`People (${membersCount})`}
                />
            );
        }
    }

    render() {
        const { extendedTeam, members } = this.props;
        const { team, reportingDetails } = extendedTeam;
        const { manager } = reportingDetails;
        const childTeams = reportingDetails.child_teams;

        let canEdit = team.permissions ? team.permissions.can_edit : false;
        return (
            <div>
                <TeamDetailHeader team={team} />
                <DetailContent>
                    {this.renderStatus(team.status, canEdit)}
                    {this.renderDescription(team, canEdit)}
                    {this.renderManager(manager)}
                    {this.renderChildTeams(childTeams, team.child_team_count)}
                    {this.renderTeamMembers(manager, members, team.profile_count)}
                </DetailContent>
            </div>
        );
    }

}

export default TeamDetail;
