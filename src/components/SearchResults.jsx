'use strict';

import React from 'react';
import { services } from 'protobufs';

import ProfileSearchResults from '../components/ProfileSearchResults';

class SearchResults extends React.Component {

    static propTypes = {
        results: React.PropTypes.array.isRequired,
    }

    _renderSearchResults() {
        // XXX move this to SearchResults which just takes results
        const {CategoryV1} = services.search.containers.search;
        let components = [];
        for (let index in this.props.results) {
            let result = this.props.results[index];
            if (result.category === CategoryV1.PROFILES) {
                components.push(<ProfileSearchResults key={index} profiles={result.profiles} />);
            }
        }
        return components;
    }

    render() {
        return (
            <div className={this.props.className}>
                {this._renderSearchResults()}
            </div>
        );
    }
}

export default SearchResults;
