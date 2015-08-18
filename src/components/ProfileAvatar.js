import _ from 'lodash';
import React from 'react';
import { services } from 'protobufs';
import shouldPureComponentUpdate from 'react-pure-render/function';

import TextFallbackAvatar from './TextFallbackAvatar';

class ProfileAvatar extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        profile: React.PropTypes.instanceOf(
            services.profile.containers.ProfileV1,
        ).isRequired,
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
