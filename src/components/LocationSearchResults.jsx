'use strict';

import React from 'react';

import LocationSearchResult from './LocationSearchResult';
import SearchResult from './SearchResult';
import SearchResultHeader from './SearchResultHeader';
import SearchResultsContainer from './SearchResultsContainer';

class LocationSearchResults extends React.Component {

    static propTypes = {
        locations: React.PropTypes.array.isRequired,
    }

    _renderLocationResults() {
        return this.props.locations.map((location, index) => {
            return <LocationSearchResult key={index} location={location} />;
        });
    }

    render() {
        return (
            <SearchResult>
                <SearchResultHeader title="Locations" />
                <SearchResultsContainer>
                    {this._renderLocationResults()}
                </SearchResultsContainer>
            </SearchResult>
        );
    }
}

export default LocationSearchResults;
