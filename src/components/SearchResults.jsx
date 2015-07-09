'use strict';

import React from 'react';
import { services } from 'protobufs';

import GroupSearchResults from '../components/GroupSearchResults';
import LocationSearchResults from '../components/LocationSearchResults';
import ProfileSearchResults from '../components/ProfileSearchResults';
import TagSearchResults from '../components/TagSearchResults';
import TeamSearchResults from '../components/TeamSearchResults';

class SearchResults extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        results: React.PropTypes.array.isRequired,
    }

    _renderSearchResults() {
        const { CategoryV1 } = services.search.containers.search;
        let components = [];
        for (let index in this.props.results) {
            let result = this.props.results[index];
            if (result.category === CategoryV1.PROFILES) {
                components.push(<ProfileSearchResults key={index} profiles={result.profiles} flux={this.props.flux} />);
            }
             else if (result.category === CategoryV1.TEAMS) {
                components.push(<TeamSearchResults key={index} teams={result.teams} flux={this.props.flux} />);
            }
            // } else if (result.category === CategoryV1.GROUPS) {
            //     components.push(<GroupSearchResults key={index} groups={result.groups} />);
            // } else if (result.category === CategoryV1.LOCATIONS) {
            //     components.push(<LocationSearchResults key={index} locations={result.locations} />);
            // } else if (result.category === CategoryV1.SKILLS) {
            //     components.push(<TagSearchResults key={index} tags={result.tags} title="Skills" />);
            // } else if (result.category === CategoryV1.INTERESTS) {
            //     components.push(<TagSearchResults key={index} tags={result.tags} title="Interests" />);
            // }
        }
        return components;
    }

    render() {
        return (
            <div className={this.props.className} style={this.props.style}>
                {this._renderSearchResults()}
            </div>
        );
    }
}

export default SearchResults;
