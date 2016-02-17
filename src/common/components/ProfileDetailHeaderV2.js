import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import DetailHeader from './DetailHeader';
import ProfileAvatar from './ProfileAvatar';

const ProfileDetailHeader = ({ profile }, { muiTheme }) => {
    return (
        <DetailHeader
            avatar={<ProfileAvatar profile={profile} style={{height: 100, width: 100}} />}
            primaryText={profile.full_name}
            secondaryText={profile.title}
        />
    );
}

ProfileDetailHeader.propTypes = {
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
};
ProfileDetailHeader.contextTypes = {
    muiTheme: PropTypes.object,
};

export default ProfileDetailHeader;
