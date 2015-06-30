'use strict';

import mui from 'material-ui';
import React from 'react';

const {Avatar} = mui;
const {Paper} = mui;

class ProfileTile extends React.Component {

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
    }

    render() {
        const profile = this.props.profile;
        return (
            <Paper>
                <Avatar src={profile.image_url} />
                <p>{profile.full_name}</p>
                <p>{profile.title}</p>
            </Paper>
        );
    }
}

export default ProfileTile;
