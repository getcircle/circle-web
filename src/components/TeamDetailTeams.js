import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getTeamLabel } from '../services/organization';

import Card from './Card';
import CardFooter from './CardFooter';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import DetailViewAll from './DetailViewAll';
import GroupIcon from './GroupIcon';
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
        onClickTeam: PropTypes.func.isRequired,
        teams: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.TeamV1),
        ).isRequired,
    }

    _renderColumn(teams) {
        const children = teams.map((item, index) => {
            return (
                <CardListItem
                    key={index}
                    leftAvatar={<IconContainer IconClass={GroupIcon} stroke={styles.icon.color} />}
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

    _handleClickAction() {
        this.refs.modal.show();
    }

    _renderCardFooter(teams) {
        if (teams.length > 4) {
            return (
                <div>
                    <CardFooter actionText="view all teams" onClick={this._handleClickAction.bind(this)}>
                        <span style={styles.teamsFooterText}>{`${teams.length} teams`}</span>
                    </CardFooter>
                    <DetailViewAll
                        items={teams}
                        onClickItem={this.props.onClickTeam}
                        ref="modal"
                        title="Teams"
                    />
                </div>
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
