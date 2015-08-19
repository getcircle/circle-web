import React from 'react';
import { services } from 'protobufs';

import { getTeamLabel } from '../services/organization';

import Card from './Card';
import CardFooter from './CardFooter';
import CardFooterProfiles from './CardFooterProfiles';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import StyleableComponent from './StyleableComponent';

import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
};

class ExtendedProfileManages extends StyleableComponent {

    static propTypes = {
        team: React.PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
        directReports: React.PropTypes.arrayOf(services.profile.containers.ProfileV1),
        onClickTeam: React.PropTypes.func,
    }

    _renderTeam() {
        const { team } = this.props;
        return (
            <CardList>
                <CardListItem
                    primaryText={team.display_name}
                    secondaryText={getTeamLabel(team)}
                    leftAvatar={<IconContainer IconClass={GroupIcon} stroke={styles.icon.color} />}
                    onTouchTap={this.props.onClickTeam}
                />
            </CardList>
        );
    }

    _renderFooter() {
        const { directReports } = this.props;
        if (directReports) {
            return (
                <CardFooter actionText="view all direct reports">
                    <CardFooterProfiles profiles={directReports} />
                </CardFooter>
            );
        }
    }

    render() {
        return (
            <Card {...this.props} title="Manages">
                <CardRow>
                    {this._renderTeam()}
                </CardRow>
                {this._renderFooter()}
            </Card>
        );
    }

}

export default ExtendedProfileManages;
