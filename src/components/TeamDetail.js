import _ from 'lodash';
import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react';

import { routeToProfile, routeToTeam } from '../utils/routes';
import t from '../utils/gettext';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
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
        extendedTeam: React.PropTypes.object.isRequired,
    }

    _renderDescription(team) {
        if (team.description) {
            return (
                <Card title="Description" style={styles.section}>
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
            <Card title="Manager" style={styles.section}>
                <CardRow>
                    <CardList>
                        <CardListItem
                            primaryText={manager.full_name}
                            secondaryText={manager.title}
                            leftAvatar={<ProfileAvatar profile={manager} />}
                            onTouchTap={routeToProfile.bind(this, manager)}
                        />
                    </CardList>
                </CardRow>
            </Card>
        );
    }

    _renderChildTeams(childTeams) {
        if (childTeams && childTeams.length) {
            return <TeamDetailTeams style={styles.section} teams={childTeams} onClickTeam={routeToTeam.bind(this)}/>;
        }
    }

    _renderTeamMembers(manager, members) {
        if (members && members.length) {
            members = _.filter(members, (profile) => profile.id !== manager.id);
            return (
                <TeamDetailTeamMembers
                    style={styles.section}
                    members={members}
                    onClickMember={routeToProfile.bind(this)}
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
