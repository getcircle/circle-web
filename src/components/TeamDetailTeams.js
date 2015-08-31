import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontWeights, fontColors, iconColors } from '../constants/styles';
import { getTeamLabel } from '../services/organization';

import Card from './Card';
import CardColumns from './CardColumns';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';

const MIN_TEAMS_TO_SHOW_FOOTER = 4;

class TeamDetailTeams extends CSSComponent {

    static propTypes = {
        onClickTeam: PropTypes.func.isRequired,
        teams: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.TeamV1),
        ).isRequired,
        totalTeamsCount: PropTypes.number.isRequired,
    }

    classes() {
        return {
            default: {
                IconContainer: {
                    ...iconColors.medium,
                },
                teamsFooterText: {
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '22px',
                    alignSelf: 'center',
                    paddingLeft: 28,
                    ...fontWeights.semiBold,
                    ...fontColors.light,
                },
            },
        };
    }

    renderColumn(teams, index) {
        const children = teams.map((item, index) => {
            return (
                <CardListItem
                    key={index}
                    leftAvatar={<IconContainer IconClass={GroupIcon} is="IconContainer" />}
                    onTouchTap={this.props.onClickTeam.bind(null, item)}
                    primaryText={item.display_name}
                    secondaryText={getTeamLabel(item)}
                />
            );
        })
        return (
            <CardList>
                {children}
            </CardList>
        );
    }

    handleClickAction() {
        this.refs.modal.show();
    }

    renderCardFooter(teams) {
        if (teams.length > MIN_TEAMS_TO_SHOW_FOOTER) {

            let actionText = '';
            if (this.props.totalTeamsCount === 1) {
                actionText = 'View 1 Team';
            } else {
                actionText = `View all ${this.props.totalTeamsCount} Teams`;
            }

            return (
                <CardFooter
                    actionText={actionText}
                    onClick={this.handleClickAction.bind(this)}
                />
            );
        }
    }

    render() {
        const { teams } = this.props;
        return (
            <Card {...this.props} title="Teams">
                <CardColumns
                    items={teams}
                    itemsPerColumn={2}
                    numberOfColumns={2}
                    renderColumn={::this.renderColumn}
                />
                {this.renderCardFooter(teams)}
            </Card>
        );
    }

}

export default TeamDetailTeams;
