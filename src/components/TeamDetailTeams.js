import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontWeights, fontColors, iconColors } from '../constants/styles';
import { getTeamLabel } from '../services/organization';

import Card from './Card';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import CSSComponent from './CSSComponent';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';

class TeamDetailTeams extends CSSComponent {

    static propTypes = {
        onClickTeam: PropTypes.func.isRequired,
        teams: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.TeamV1),
        ).isRequired,
    }

    classes() {
        return {
            default: {
                CardList: {
                    className: 'col-xs',
                },
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

    renderColumn(teams) {
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
            <CardList is="CardList">
                {children}
            </CardList>
        );
    }

    handleClickAction() {
        this.refs.modal.show();
    }

    renderCardFooter(teams) {
        if (teams.length > 4) {
            return (
                <CardFooter
                    actionText="view all teams"
                    onClick={this.handleClickAction.bind(this)}
                />
            );
        }
    }

    render() {
        const { teams } = this.props;
        // break out teams into two columns with a max of two teams each
        const firstColumn = teams.slice(0, 2);
        const secondColumn = teams.slice(2, 4);
        return (
            <Card {...this.props} title="Teams">
                <CardRow>
                    {this.renderColumn(firstColumn)}
                    <CardVerticalDivider />
                    {this.renderColumn(secondColumn)}
                </CardRow>
                {this.renderCardFooter(teams)}
            </Card>
        );
    }

}

export default TeamDetailTeams;
