import { decorate } from 'react-mixin';
import { ListItem } from 'material-ui';
import { Navigation } from 'react-router';
import React, { PropTypes } from 'react';

import { routeToProfile } from '../utils/routes';

import ProfileAvatar from './ProfileAvatar';
import StyleableComponent from './StyleableComponent';

@decorate(Navigation)
class ProfileSearchResult extends StyleableComponent {

    static propTypes = {
        onClick: PropTypes.func,
        profile: PropTypes.object.isRequired,
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
