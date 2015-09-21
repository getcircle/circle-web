import { List, ListDivider } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import LocationSearchResult from './LocationSearchResult';
import ProfileSearchResult from './ProfileSearchResult';
import StyleableComponent from './StyleableComponent';
import TeamSearchResult from './TeamSearchResult';

class SearchResults extends StyleableComponent {

    static propTypes = {
        onClickResult: PropTypes.func,
        results: PropTypes.array.isRequired,
    }

    _renderSearchResults() {
        let components = [];
        let key = 0;
        const { onClickResult } = this.props;
        for (let index in this.props.results) {
            key += index;
            let result = this.props.results[index];
            if (result.profile) {
                components.push(<ProfileSearchResult key={key} onClick={onClickResult} profile={result.profile} />);
            } else if (result.team) {
                components.push(<TeamSearchResult key={key} onClick={onClickResult} team={result.team} />);
            } else if (result.location) {
                components.push(<LocationSearchResult key={key} location={result.location} onClick={onClickResult} />);
            } else if (result instanceof services.profile.containers.ProfileV1) {
                components.push(<ProfileSearchResult key={key} onClick={onClickResult} profile={result} />);
            } else if (result instanceof services.organization.containers.TeamV1) {
                components.push(<TeamSearchResult key={key} onClick={onClickResult} team={result} />);
            } else if (result instanceof services.organization.containers.LocationV1) {
                components.push(<LocationSearchResult key={key} location={result} onClick={onClickResult} />);
            }
            if (parseInt(index) + 1 !== this.props.results.length) {
                key += 1
                components.push(<ListDivider inset={true} key={key} />);
            }
        }
        return components;
    }

    render() {
        const {
            onClickResult,
            results,
            ...other
        } = this.props;
        return (
            <List {...other}>
                {this._renderSearchResults()}
            </List>
        );
    }
}

export default SearchResults;
