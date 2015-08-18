
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React, { Component } from 'react';
import { services } from 'protobufs';
import shouldPureComponentUpdate from 'react-pure-render/function';

import autoBind from '../utils/autoBind';

import Card from './Card';
import CardFooter from './CardFooter';
import CardListItem from './CardListItem';
import CardVerticalDivider from './CardVerticalDivider';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';

const {
    FlatButton,
    List,
} = mui;

const { StylePropable } = mui.Mixins;

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
    footerAvatar: {
        display: 'inline-block',
        paddingLeft: 10,
    },
    footerAvatars: {
        paddingLeft: 10,
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    managerInnerDiv: {
    },
    row: {
        width: '100%',
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

    _getTeamSecondaryText(team) {
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
        return parts.join(', ');
    }

    _getManagerSecondaryText(manager) {
        const parts = [manager.full_name, manager.title];
        return parts.join(', ');
    }

    _renderTeam() {
        const { team } = this.props;
        return (
            <List className="col-xs" style={styles.list}>
                <CardListItem
                    primaryText={team.name}
                    secondaryText={this._getTeamSecondaryText(team)}
                    leftAvatar={<IconContainer IconClass={GroupIcon} stroke={styles.icon.color} />}
                />
            </List>
        );
    }

    _renderManager() {
        const { manager } = this.props;
        return (
            <List className="col-xs" style={styles.list}>
                <CardListItem
                    primaryText="Reports to"
                    secondaryText={this._getManagerSecondaryText(manager)}
                    leftAvatar={<ProfileAvatar profile={manager} />}
                />
            </List>
        );
    }

    _renderFooter() {
        const { peers } = this.props;
        if (peers) {
            const containers = peers.slice(0, 5).map((item, index) => {
                return (
                    <div key={index} style={styles.footerAvatar}>
                        <ProfileAvatar profile={item} />
                    </div>
                );
            });
            return (
                <CardFooter className="row" actionText="view all team members">
                    <div style={this.mergeAndPrefix(styles.footerAvatars)}>
                        {containers}
                    </div>
                </CardFooter>
            );
        }
    }

    render() {
        return (
            <Card {...this.props} title="Team">
                <div className="row" style={styles.row}>
                    {this._renderTeam()}
                    <CardVerticalDivider />
                    {this._renderManager()}
                </div>
                {this._renderFooter()}
            </Card>
        );
    }

}

export default ExtendedProfileTeam;
