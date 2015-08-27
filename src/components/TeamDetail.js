import _ from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { routeToProfile, routeToTeam } from '../utils/routes';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import DetailContent from './DetailContent';
import ProfileAvatar from './ProfileAvatar';
import StyleableComponent from './StyleableComponent';
import TeamDetailHeader from './TeamDetailHeader';
import TeamDetailTeamMembers from './TeamDetailTeamMembers';
import TeamDetailTeams from './TeamDetailTeams';

const styles = {
    description: {
        padding: 20,
        lineHeight: '24px',
        fontSize: '14px',
    },
    section: {
        marginTop: 20,
    },
};

class TeamDetail extends StyleableComponent {

    static propTypes = {
        extendedTeam: PropTypes.shape({
            reportingDetails: PropTypes.object.isRequired,
            team: PropTypes.object.isRequired,
        }),
        members: PropTypes.arrayOf(services.profile.containers.ProfileV1),
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    renderDescription(team) {
        if (team.description) {
            return (
                <Card style={styles.section} title="Description">
                    <CardRow>
                        <span style={styles.description}>
                            {team.description.value}
                        </span>
                    </CardRow>
                </Card>
            );
        }
    }

    renderManager(manager) {
        return (
            <Card style={styles.section} title="Manager">
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

    renderChildTeams(childTeams) {
        if (childTeams && childTeams.length) {
            return (
                <TeamDetailTeams
                    onClickTeam={routeToTeam.bind(null, this.context.router)}
                    style={styles.section}
                    teams={childTeams}
                />
            );
        }
    }

    renderTeamMembers(manager, members) {
        if (members && members.length) {
            members = _.filter(members, (profile) => profile.id !== manager.id);
            return (
                <TeamDetailTeamMembers
                    members={members}
                    onClickMember={routeToProfile.bind(null, this.context.router)}
                    style={styles.section}
                />
            );
        }
    }

    render() {
        const { extendedTeam, members } = this.props;
        const { team, reportingDetails } = extendedTeam;
        const { manager } = reportingDetails;
        const childTeams = reportingDetails.child_teams;
        return (
            <div>
                <TeamDetailHeader team={team} />
                <DetailContent>
                    {this.renderDescription(team)}
                    {this.renderManager(manager)}
                    {this.renderChildTeams(childTeams)}
                    {this.renderTeamMembers(manager, members)}
                </DetailContent>
            </div>
        );
    }

}

export default TeamDetail;
