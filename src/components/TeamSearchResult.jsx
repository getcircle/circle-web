'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import bindThis from '../utils/bindThis';

import TextFallbackAvatar from './TextFallbackAvatar';

const {
    ListItem,
} = mui;

@decorate(Navigation)
class TeamSearchResult extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        team: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
    }

    @bindThis
    _handleTouchTap() {
        this.props.flux.getActions('SearchActions').clearResults();
        this.transitionTo(`/team/${this.props.team.id}`);
    }

    render() {
        const team = this.props.team;
        return (
            <ListItem
                leftAvatar={<TextFallbackAvatar fallbackText={team.name[0]} />}
                onTouchTap={this._handleTouchTap}
            >
                {team.name}
            </ListItem>
        );
    }
}

export default TeamSearchResult;
