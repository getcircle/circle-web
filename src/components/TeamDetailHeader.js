import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CSSComponent from './CSSComponent';
import DetailHeader from './DetailHeader';
import GroupIcon from './GroupIcon'
import IconContainer from './IconContainer';

class TeamDetailHeader extends CSSComponent {

    static propTypes = {
        team: PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    classes() {
        return {
            default: {
                icon: {
                    height: 80,
                    width: 80,
                    color: 'white',
                    strokeWidth: 1,
                },
                iconSection: {
                    position: 'relative',
                    paddingTop: 60,
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
                    paddingTop: 10,
                },
                nameSection: {
                    paddingTop: 20,
                },
            },
        };
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
        let iconColor = {...this.styles().icon}.color;
        let iconStrokeWidth = {...this.styles().icon}.strokeWidth;
        return (
            <DetailHeader>
                <div className="row center-xs" is="iconSection">
                    <IconContainer
                        IconClass={GroupIcon}
                        iconStyle={{...this.styles().icon}}
                        is="iconContainer"
                        stroke={iconColor}
                        strokeWidth={iconStrokeWidth}
                    />
                </div>
                <div className="row center-xs" is="nameSection">
                    <span style={this.context.muiTheme.commonStyles.headerPrimaryText}>{team.display_name}</span>
                </div>
                <div className="row center-xs" is="infoSection">
                    <span style={this.context.muiTheme.commonStyles.headerSecondaryText}>{this._getTeamInfo(team)}</span>
                </div>
            </DetailHeader>
        );
    }

}

export default TeamDetailHeader;
