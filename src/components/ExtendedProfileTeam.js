import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React, { Component } from 'react';
import { services } from 'protobufs';
import shouldPureComponentUpdate from 'react-pure-render/function';

import autoBind from '../utils/autoBind';
import { getTeamLabel } from '../services/organization';

import Card from './Card';
import CardFooter from './CardFooter';
import CardFooterProfiles from './CardFooterProfiles';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';

const { StylePropable } = mui.Mixins;

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
};

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class ExtendedProfileTeam extends Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        manager: React.PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        peers: React.PropTypes.arrayOf(services.profile.containers.ProfileV1),
        team: React.PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
    }

    _getManagerSecondaryText(manager) {
        const parts = [manager.full_name, manager.title];
        return parts.join(', ');
    }

    _renderTeam() {
        const { team } = this.props;
        return (
            <CardList>
                <CardListItem
                    primaryText={team.name}
                    secondaryText={getTeamLabel(team)}
                    leftAvatar={<IconContainer IconClass={GroupIcon} stroke={styles.icon.color} />}
                />
            </CardList>
        );
    }

    _renderManager() {
        const { manager } = this.props;
        return (
            <CardList>
                <CardListItem
                    primaryText="Reports to"
                    secondaryText={this._getManagerSecondaryText(manager)}
                    leftAvatar={<ProfileAvatar profile={manager} />}
                />
            </CardList>
        );
    }

    _renderFooter() {
        const { peers } = this.props;
        if (peers) {
            return (
                <CardFooter actionText="view all team members">
                    <CardFooterProfiles profiles={peers} />
                </CardFooter>
            );
        }
    }

    render() {
        return (
            <Card {...this.props} title="Team">
                <CardRow>
                    {this._renderTeam()}
                    <CardVerticalDivider />
                    {this._renderManager()}
                </CardRow>
                {this._renderFooter()}
            </Card>
        );
    }

}

export default ExtendedProfileTeam;
