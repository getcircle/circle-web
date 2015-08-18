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
        // if (team.description) {
        if (true) {
            return (
                <Card title="Description" style={styles.section}>
                    <CardRow>
                        <span style={styles.description}>
                            Some description about the team
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
        if (childTeams) {
            return <TeamDetailTeams style={styles.section} teams={childTeams}/>;
        }
    }

    render() {
        const { extendedTeam } = this.props;
        const { team, reportingDetails } = extendedTeam;
        const { manager, members, childTeams } = reportingDetails;
        return (
            <div>
                <TeamDetailHeader team={team} />
                <DetailContent>
                    {this._renderDescription(team)}
                    {this._renderManager(manager)}
                    {this._renderChildTeams(childTeams)}
                </DetailContent>
            </div>
        );
    }

}

export default TeamDetail;
