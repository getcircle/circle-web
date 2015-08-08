import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import ProfileAvatar from './ProfileAvatar';

const { ListItem } = mui;

@decorate(Navigation)
class ProfileSearchResult extends React.Component {

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
    }

    _handleTouchTap(profile) {
        this.props.flux.getActions('SearchActions').clearResults();
        this.transitionTo(`/profile/${profile.id}`);
    }

    render() {
        const profile = this.props.profile;
        return (
            <ListItem
                leftAvatar={<ProfileAvatar profile={profile} />}
                onTouchTap={this._handleTouchTap.bind(this, profile)}
                primaryText={profile.full_name}
                secondaryText={profile.title}
            />
        );
    }

}

export default ProfileSearchResult;
