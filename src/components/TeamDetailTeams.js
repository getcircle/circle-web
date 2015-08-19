import React from 'react';
import { services } from 'protobufs';

import { getTeamLabel } from '../services/organization';

import Card from './Card';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import GroupIcon from './OfficeIcon';
import IconContainer from './IconContainer';
import StyleableComponent from './StyleableComponent';

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
    teamsFooterText: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '22px',
        alignSelf: 'center',
        paddingLeft: 28,
        color: 'rgba(0, 0, 0, .6)',
    },
};

class TeamDetailTeams extends StyleableComponent {

    static propTypes = {
        teams: React.PropTypes.arrayOf(
            React.PropTypes.instanceOf(services.organization.containers.TeamV1),
        ).isRequired,
        onClickTeam: React.PropTypes.func.isRequired,
    }

    _renderColumn(teams) {
        const children = teams.map((item, index) => {
            return (
                <CardListItem
                    key={index}
                    primaryText={item.name}
                    secondaryText={getTeamLabel(item)}
                    leftAvatar={<IconContainer IconClass={GroupIcon} stroke={styles.icon.color} />}
                    onTouchTap={this.props.onClickTeam.bind(null, item)}
                />
            );
        })
        return (
            <CardList>
                {children}
            </CardList>
        );
    }

    _renderCardFooter(teams) {
        if (teams.length > 4) {
            return (
                <CardFooter actionText="view all teams">
                    <span style={styles.teamsFooterText}>{`${teams.length} teams`}</span>
                </CardFooter>
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
                    {this._renderColumn(firstColumn)}
                    <CardVerticalDivider />
                    {this._renderColumn(secondColumn)}
                </CardRow>
                {this._renderCardFooter(teams)}
            </Card>
        );
    }

}

export default TeamDetailTeams;
