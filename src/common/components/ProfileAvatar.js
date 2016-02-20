import { capitalize } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import TextFallbackAvatar from './TextFallbackAvatar';

export function getInitials(profile) {
    const characters = [];
    for (let name of [profile.first_name]) {
        if (name && typeof name === 'string') {
            characters.push(capitalize(name[0]));
        }
    }
    return characters.join('');
}

class ProfileAvatar extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.profile.id !== this.props.profile.id);
    }

    render() {
        const { profile, ...other } = this.props;
        const initials = getInitials(profile);
        return (
            <TextFallbackAvatar
                {...other}
                fallbackText={initials}
                src={profile.image_url || profile.small_image_url}
            />
        );
    }
}

ProfileAvatar.propTypes = {
    profile: PropTypes.instanceOf(
        services.profile.containers.ProfileV1,
    ).isRequired,
};

export default ProfileAvatar;
