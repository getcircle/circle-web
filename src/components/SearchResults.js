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
        for (let index in this.props.results) {
            let result = this.props.results[index];
            if (result.profile) {
                components.push(<ProfileSearchResult key={index} profile={result.profile} />);
            } else if (result.team) {
                components.push(<TeamSearchResult key={index} team={result.team} />);
            } else if (result.location) {
                components.push(<LocationSearchResult key={index} location={result.location} />);
            }
            if (parseInt(index) + 1 != this.props.results.length) {
                components.push(<ListDivider inset={true} />);
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
