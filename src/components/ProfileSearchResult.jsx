'use strict';

import mui from 'material-ui';
import React from 'react';

const {Avatar} = mui;

class ProfileSearchResult extends React.Component {

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
    }

    render() {
        const profile = this.props.profile;
        return (
            <div>
                <Avatar src={profile.image_url} />
                <span>{profile.full_name}</span>
                <span>{profile.title}</span>
            </div>
        );
    }

}

export default ProfileSearchResult;
