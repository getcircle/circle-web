import mui from 'material-ui';
import React from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import LocationSearchResult from '../components/LocationSearchResult';
import ProfileSearchResult from '../components/ProfileSearchResult';
import TeamSearchResult from '../components/TeamSearchResult';

const { 
    List,
    ListDivider,
} = mui;

class SearchResults extends React.Component {

    static propTypes = {
        results: React.PropTypes.array.isRequired,
    }

    _renderSearchResults() {
        let components = [];
        let key = 0;
        for (let index in this.props.results) {
            key += index;
            let result = this.props.results[index];
            if (result.profile) {
                components.push(<ProfileSearchResult key={key} profile={result.profile} />);
            } else if (result.team) {
                components.push(<TeamSearchResult key={key} team={result.team} />);
            } else if (result.location) {
                components.push(<LocationSearchResult key={key} location={result.location} />);
            } else if (result instanceof services.profile.containers.ProfileV1) {
                components.push(<ProfileSearchResult key={key} profile={result} />);
            } else if (result instanceof services.organization.containers.TeamV1) {
                components.push(<TeamSearchResult key={key} team={result} />);
            } else if (result instanceof services.organization.containers.LocationV1) {
                components.push(<LocationSearchResult key={key} location={result} />);
            }
            if (parseInt(index) + 1 != this.props.results.length) {
                key += 1
                components.push(<ListDivider key={key} inset={true} />);
            }
        }
        return components;
    }

    render() {
        return (
            <List className={this.props.className} style={this.props.style}>
                {this._renderSearchResults()}
            </List>
        );
    }
}

export default SearchResults;
