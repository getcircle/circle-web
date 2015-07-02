'use strict';

import React from 'react';

import SearchResult from './SearchResult';
import SearchResultHeader from './SearchResultHeader';
import SearchResultsContainer from './SearchResultsContainer';
import TagSearchResult from './TagSearchResult';

class TagSearchResults extends React.Component {

    static propTypes = {
        title: React.PropTypes.string,
        tags: React.PropTypes.array.isRequired,
    }

    _renderTagResults() {
        return this.props.tags.map((tag, index) => {
            return <TagSearchResult key={index} tag={tag} />;
        });
    }

    render() {
        const title = this.props.title ? this.props.title : 'Tags';
        return (
            <SearchResult>
                <SearchResultHeader title={title} />
                <SearchResultsContainer>
                    {this._renderTagResults()}
                </SearchResultsContainer>
            </SearchResult>
        );
    }
}

export default TagSearchResults;
