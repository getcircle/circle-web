import { capitalize } from 'lodash';
import React, { PropTypes } from 'react';
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

const ProfileAvatar = ({profile, ...other}) => {
    const initials = getInitials(profile);
    return (
        <TextFallbackAvatar
            {...other}
            fallbackText={initials}
            src={profile.image_url || profile.small_image_url}
        />
    );
};

ProfileAvatar.propTypes = {
    profile: PropTypes.instanceOf(
        services.profile.containers.ProfileV1,
    ).isRequired,
};

export default ProfileAvatar;
