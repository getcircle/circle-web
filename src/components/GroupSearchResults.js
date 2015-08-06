import React from 'react';

import GroupSearchResult from './GroupSearchResult';
import SearchResult from './SearchResult';
import SearchResultHeader from './SearchResultHeader';
import SearchResultsContainer from './SearchResultsContainer';

class GroupSearchResults extends React.Component {

    static propTypes = {
        groups: React.PropTypes.array.isRequired,
    }

    _renderGroupResults() {
        return this.props.groups.map((group, index) => {
            return <GroupSearchResult key={index} group={group} />;
        });
    }

    render() {
        return (
            <SearchResult>
                <SearchResultHeader title="Groups" />
                <SearchResultsContainer>
                    {this._renderGroupResults()}
                </SearchResultsContainer>
            </SearchResult>
        );
    }

}

export default GroupSearchResults;
