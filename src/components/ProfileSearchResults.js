import mui from 'material-ui';
import React from 'react';

import t from '../utils/gettext';

import ProfileSearchResult from './ProfileSearchResult';

const { List } = mui;

class ProfileSearchResults extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        profiles: React.PropTypes.array.isRequired,
    }

    _renderProfileResults() {
        return this.props.profiles.map((profile, index) => {
            return <ProfileSearchResult key={index} profile={profile} flux={this.props.flux} />;
        });
    }

    render() {
        return (
            <List subheader={t('Profiles')}>
                {this._renderProfileResults()}
            </List>
        );
    };

}

export default ProfileSearchResults;
