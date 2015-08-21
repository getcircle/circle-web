import { Dialog, List } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getTeamLabel } from '../services/organization';

import StyleableComponent from './StyleableComponent';

import Card from './Card';
import CardFooter from './CardFooter';
import CardFooterProfiles from './CardFooterProfiles';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import DetailViewAll from './DetailViewAll';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';
import ProfileSearchResult from './ProfileSearchResult';
import Search from '../components/Search';

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
};

class ExtendedProfileTeam extends StyleableComponent {

    static propTypes = {
        manager: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        onClickManager: PropTypes.func,
        onClickTeam: PropTypes.func,
        onClickPeer: PropTypes.func,
        peers: PropTypes.arrayOf(services.profile.containers.ProfileV1),
        team: PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
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
                    primaryText={team.display_name}
                    secondaryText={getTeamLabel(team)}
                    leftAvatar={<IconContainer IconClass={GroupIcon} stroke={styles.icon.color} />}
                    onTouchTap={this.props.onClickTeam}
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
                    onTouchTap={this.props.onClickManager}
                />
            </CardList>
        );
    }

    _handleClickAction() {
        this.refs.modal.show();
    }

    _renderFooter() {
        const { peers } = this.props;
        if (peers && peers.length) {
            return (
                <div>
                    <CardFooter
                        actionText="view all team members"
                        onClick={this._handleClickAction.bind(this)}
                    >
                        <CardFooterProfiles profiles={peers} />
                    </CardFooter>
                    <DetailViewAll
                        ref="modal"
                        title="Team Members"
                        onClickItem={this.props.onClickPeer}
                        items={peers}
                    />
                </div>
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
