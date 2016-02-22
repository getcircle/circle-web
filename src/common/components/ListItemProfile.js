import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import ProfileAvatar from './ProfileAvatar';

const ListItemProfile = ({ primaryText, profile, secondaryText, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.listItemProfile;
    if (!primaryText) {
        primaryText = <span style={theme.primaryText}>{profile.full_name}</span>;
    }

    if (!secondaryText) {
        secondaryText = (
            <div>
                <span style={theme.secondaryText}>{profile.display_title}</span>
            </div>
        );
    }

    return (
        <ListItem
            innerDivStyle={theme.innerDivStyle}
            leftAvatar={<ProfileAvatar profile={profile} style={theme.avatar} />}
            primaryText={primaryText}
            secondaryText={secondaryText}
            {...other}
        />
    );
};

ListItemProfile.propTypes = {
    primaryText: PropTypes.node,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    secondaryText: PropTypes.node,
};

ListItemProfile.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};
export default ListItemProfile;
