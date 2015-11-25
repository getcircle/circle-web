import _ from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import StyleableComponent from './StyleableComponent';
import TextFallbackAvatar from './TextFallbackAvatar';

class ProfileAvatar extends StyleableComponent {

    static propTypes = {
        profile: PropTypes.instanceOf(
            services.profile.containers.ProfileV1,
        ).isRequired,
    }

    _getInitials() {
        const profile = this.props.profile;
        return [profile.first_name[0]].map((character, index) => _.capitalize(character)).join('');
    }

    render() {
        const {
            profile,
            ...other
        } = this.props;
        return (
            <TextFallbackAvatar
                {...other}
                fallbackText={this._getInitials()}
                src={profile.image_url || profile.small_image_url}
            />
        );
    }
}

export default ProfileAvatar;
