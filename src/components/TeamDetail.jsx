'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import t from '../utils/gettext';

import ProfileAvatar from './ProfileAvatar';
import TextFallbackAvatar from './TextFallbackAvatar';

const {
    List,
    ListItem,
} = mui;

@decorate(Navigation)
class TeamDetail extends React.Component {

    static propTypes = {
        descendants: React.PropTypes.array.isRequired,
        team: React.PropTypes.object.isRequired,
        owner: React.PropTypes.object.isRequired,
        members: React.PropTypes.array.isRequired,
    }

    styles = {
        sectionTitle: {
            color: '#666',
            fontSize: '16px',
            letterSpacing: '1px',
            paddingLeft: 0,
            paddingTop: 10,
            textTransform: 'uppercase',
            fontWeight: 'normal',
        },
    }

    _routeToProfile(profile) {
        this.transitionTo(`/profile/${profile.id}`);
    }

    _routeToTeam(team) {
        this.transitionTo(`/team/${team.id}`);
    }

    _renderTeamParent(team) {
        if (team.path.length >= 2) {
            const parent = team.path[team.path.length - 2];
            return (
                <div className="row start-xs">
                    <h2 className="content__header--secondary">
                        {parent.name}
                    </h2>
                </div>
            );
        }
    }

    _renderOwner(owner) {
        return (
            <List subheader={t('Owner')} subheaderStyle={this.styles.sectionTitle}>
                <ListItem
                    leftAvatar={<ProfileAvatar profile={owner} />}
                    secondaryText={owner.title}
                    onTouchTap={this._routeToProfile.bind(this, owner)}
                >
                    {owner.full_name}
                </ListItem>
            </List>
        );
    }

    _renderMembers(members) {
        const children = members.map((member, index) => {
            return <ListItem
                        key={index}
                        leftAvatar={<ProfileAvatar profile={member} />}
                        secondaryText={member.title}
                        onTouchTap={this._routeToProfile.bind(this, member)}
                    >
                        {member.full_name}
                    </ListItem>;
        });
        return (
            <List subheader={t('Members')} subheaderStyle={this.styles.sectionTitle}>
                {children}
            </List>
        );
    }

    _renderDescendants(descendants) {
        if (descendants.length) {
            const children = descendants.map((team, index) => {
                return <ListItem
                            key={index}
                            leftAvatar={<TextFallbackAvatar fallbackText={team.name[0]} />}
                            onTouchTap={this._routeToTeam.bind(this, team)}
                        >
                            {team.name}
                        </ListItem>;
            });
            return (
                <List subheader={t('Teams')} subheaderStyle={this.styles.sectionTitle}>
                    {children}
                </List>
            );
        }
    }

    render() {
        const {
            descendants,
            members,
            owner,
            team,
        } = this.props;

        return (
            <div className="row item_detail">
                <div className="col-sm-offset-3 col-sm-9 item_detail__details">
                    <div className="row start-xs">
                        <h1>{team.name}</h1>
                    </div>
                    {this._renderTeamParent(team)}
                    {this._renderOwner(owner)}
                    {this._renderMembers(members)}
                    {this._renderDescendants(descendants)}
                </div>
            </div>
        );
    }
}

export default TeamDetail;
