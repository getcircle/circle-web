import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors, fontWeights } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import DetailHeader from './DetailHeader';
import GroupIcon from './GroupIcon'
import IconContainer from './IconContainer';

class TeamDetailHeader extends CSSComponent {

    static propTypes = {
        isEditable: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        onEditTapped: PropTypes.func,
        team: PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    classes() {
        return {
            default: {
                editButtonContainer: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                },
                editButton: {
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    margin: '16px 16px 0 16px',
                    fontSize: 11,
                    letterSpacing: '1px',
                    ...fontColors.white,
                    ...fontWeights.semiBold,
                },
                icon: {
                    height: 80,
                    width: 80,
                    color: 'white',
                    strokeWidth: 1,
                },
                iconSection: {
                    position: 'relative',
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
            'isEditable-false': {
                iconSection: {
                    paddingTop: 60,
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

    renderEditButton() {
        const {
            isEditable,
        } = this.props;

        if (!isEditable) {
            return;
        }

        return (
            <div className="row" is="editButtonContainer">
                <FlatButton
                    is="editButton"
                    label={t('Edit Team')}
                    onTouchTap={() => {
                        this.props.onEditTapped();
                    }}
                />
            </div>
        );

    }

    render() {
        const { team } = this.props;
        let iconColor = {...this.styles().icon}.color;
        let iconStrokeWidth = {...this.styles().icon}.strokeWidth;
        return (
            <DetailHeader>
                {this.renderEditButton()}
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
