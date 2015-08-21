import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import DetailHeader from './DetailHeader';
import GroupIcon from './GroupIcon'
import IconContainer from './IconContainer';
import StyleableComponent from './StyleableComponent';

const styles = {
    icon: {
        height: 80,
        width: 80,
        color: 'white',
        strokeWidth: 1,
    },
    iconContainer: {
        position: 'relative',
        height: 120,
        width: 120,
        border: '1px solid white',
        top: 0,
        left: 0,
    },
    infoSection: {
        paddingTop: 8,
    },
    info: {
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, .8)',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '17px',
    },
    name: {
        color: 'white',
        fontSize: '36px',
        fontWeight: 300,
    },
    nameSection: {
        paddingTop: 20,
    },
    teamIconSection: {
        position: 'relative',
        paddingTop: 60,
    },
};

class TeamDetailHeader extends StyleableComponent {

    static propTypes = {
        team: PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
    }

    _getTeamInfo(team) {
        let parts = [];
        if (team.child_team_count > 1) {
            parts.push(`${team.child_team_count} teams`);
        } else if (team.child_team_count === 1) {
            parts.push(`${team.child_team_count} team`);
        }

        if (team.profile_count > 1) {
            parts.push(`${team.profile_count} people`);
        } else if (team.profile_count === 1) {
            parts.push(`${team.profile_count} person`);
        }

        return parts.join(' | ');
    }

    render() {
        const { team } = this.props;
        return (
            <DetailHeader>
                <div className="row center-xs" style={styles.teamIconSection}>
                    <IconContainer
                        IconClass={GroupIcon}
                        iconStyle={styles.icon}
                        stroke={styles.icon.color}
                        strokeWidth={styles.icon.strokeWidth}
                        style={styles.iconContainer}
                    />
                </div>
                <div className="row center-xs" style={styles.nameSection}>
                    <span style={styles.name}>{team.display_name}</span>
                </div>
                <div className="row center-xs" style={styles.infoSection}>
                    <span style={styles.info}>{this._getTeamInfo(team)}</span>
                </div>
            </DetailHeader>
        );
    }

}

export default TeamDetailHeader;
