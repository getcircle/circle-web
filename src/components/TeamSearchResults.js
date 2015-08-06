'use strict';

import mui from 'material-ui';
import React from 'react';

import t from '../utils/gettext';

import TeamSearchResult from './TeamSearchResult';

const { List } = mui;

class TeamSearchResults extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        teams: React.PropTypes.array.isRequired,
    }

    _renderTeamResults() {
        return this.props.teams.map((team, index) => {
            return <TeamSearchResult key={index} team={team} flux={this.props.flux} />;
        });
    }

    render() {
        return (
            <List subheader={t('Teams')}>
                {this._renderTeamResults()}
            </List>
        );
    }
}

export default TeamSearchResults;
