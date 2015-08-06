'use strict';

import _ from 'lodash';
import React from 'react';

import TextFallbackAvatar from './TextFallbackAvatar';

class ProfileAvatar extends React.Component {

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
    }

    _getInitials() {
        const profile = this.props.profile;
        return [profile.first_name[0], profile.last_name[0]].map((character, index) => _.capitalize(character)).join('');
    }

    render() {
        const {
            profile,
            ...other
        } = this.props;

        return <TextFallbackAvatar
                    src={profile.image_url || profile.small_image_url}
                    fallbackText={this._getInitials()}
                    {...other}
                />;
    }
}

export default ProfileAvatar;
