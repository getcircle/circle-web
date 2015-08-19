import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import { routeToProfile } from '../utils/routes';

import ProfileAvatar from './ProfileAvatar';

const { ListItem } = mui;

@decorate(Navigation)
class ProfileSearchResult extends React.Component {

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
        onClick: React.PropTypes.func,
    }

    _handleTouchTap(profile) {
        if (this.props.onClick) {
            this.props.onClick();
        }
        routeToProfile.apply(this, [profile]);
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
