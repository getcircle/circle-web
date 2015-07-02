'use strict';

import React from 'react';

import SearchResult from './SearchResult';
import SearchResultHeader from './SearchResultHeader';
import SearchResultsContainer from './SearchResultsContainer';
import TeamSearchResult from './TeamSearchResult';

class TeamSearchResults extends React.Component {

    static propTypes = {
        teams: React.PropTypes.array.isRequired,
    }

    _renderTeamResults() {
        return this.props.teams.map((team, index) => {
            return <TeamSearchResult key={index} team={team} />;
        });
    }

    render() {
        return (
            <SearchResult>
                <SearchResultHeader title="Teams" />
                <SearchResultsContainer>
                    {this._renderTeamResults()}
                </SearchResultsContainer>
            </SearchResult>
        );
    }
}

export default TeamSearchResults;
