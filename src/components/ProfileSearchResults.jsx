'use strict';

import mui from 'material-ui';
import React from 'react';

import ProfileSearchResult from './ProfileSearchResult';
import SearchResult from './SearchResult';
import SearchResultHeader from './SearchResultHeader';
import SearchResultsContainer from './SearchResultsContainer';

const { List } = mui;

class ProfileSearchResults extends React.Component {

    static propTypes = {
        profiles: React.PropTypes.array.isRequired,
    }

    _renderProfileResults() {
        return this.props.profiles.map((profile, index) => {
            return <ProfileSearchResult key={index} profile={profile} />;
        });
    }

    render() {
        return (
            <List subheader="Profiles">
                {this._renderProfileResults()}
            </List>
        );
    };

}

export default ProfileSearchResults;
