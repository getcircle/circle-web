import _ from 'lodash';
import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
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

@decorate(Navigation)
class TeamDetail extends StyleableComponent {

    static propTypes = {
        extendedTeam: PropTypes.object.isRequired,
        members: PropTypes.arrayOf(services.profile.containers.ProfileV1),
    }

    _renderDescription(team) {
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

    _renderManager(manager) {
        return (
            <Card style={styles.section} title="Manager">
                <CardRow>
                    <CardList>
                        <CardListItem
                            leftAvatar={<ProfileAvatar profile={manager} />}
                            onTouchTap={routeToProfile.bind(this, manager)}
                            primaryText={manager.full_name}
                            secondaryText={manager.title}
                        />
                    </CardList>
                </CardRow>
            </Card>
        );
    }

    _renderChildTeams(childTeams) {
        if (childTeams && childTeams.length) {
            return <TeamDetailTeams onClickTeam={routeToTeam.bind(this)} style={styles.section} teams={childTeams} />;
        }
    }

    _renderTeamMembers(manager, members) {
        if (members && members.length) {
            members = _.filter(members, (profile) => profile.id !== manager.id);
            return (
                <TeamDetailTeamMembers
                    members={members}
                    onClickMember={routeToProfile.bind(this)}
                    style={styles.section}
                />
            );
        }
    }

    render() {
        const { extendedTeam, members } = this.props;
        const { team, reportingDetails } = extendedTeam;
        const { manager, childTeams } = reportingDetails;
        return (
            <div>
                <TeamDetailHeader team={team} />
                <DetailContent>
                    {this._renderDescription(team)}
                    {this._renderManager(manager)}
                    {this._renderChildTeams(childTeams)}
                    {this._renderTeamMembers(manager, members)}
                </DetailContent>
            </div>
        );
    }

}

export default TeamDetail;
