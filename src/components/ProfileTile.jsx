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
        // "Avatar" seems to be causing the page to load slowly since its fetching all the images at once. Is there a better way we can do this where the images will fade in as well?
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
