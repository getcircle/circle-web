import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import ProfileAvatar from './ProfileAvatar';

const DetailListItemProfile = ({ profile }) => {
    return (
        <ListItem
            leftAvatar={<ProfileAvatar profile={profile} />}
            primaryText={profile.full_name}
            secondaryText={profile.title}
        />
    );
};

DetailListItemProfile.propTypes = {
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
};

export default DetailListItemProfile;
