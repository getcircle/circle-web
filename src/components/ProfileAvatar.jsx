'use strict';

import _ from 'lodash';
import mui from 'material-ui';
import React from 'react';

import bindThis from '../utils/bindThis';

const { Avatar } = mui;

const styles = {
    avatar: {
        display: 'flex',
    },
};

class ProfileAvatar extends React.Component {

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
    }

    constructor() {
        super();
        this.state = {
            imageSrc: null,
        };
    }

    componentWillMount() {
        const { profile } = this.props;
        this.setState({imageSrc: profile.small_image_url || profile.image_url});
    }

    @bindThis
    _handleImageError() {
        this.setState({imageSrc: null});
    }

    _renderInitials() {
        if (this.state.imageSrc === null) {
            const profile = this.props.profile;
            return [profile.first_name[0], profile.last_name[0]].map((character, index) => _.capitalize(character));
        }
    }

    render() {
        const avatarStyle = _.assign({}, styles.avatar, this.props.style);
        return (
            <div className={this.props.className}>
                <Avatar className="content--center--h content--center--v" src={this.state.imageSrc} style={avatarStyle} onError={this._handleImageError}>
                    {this._renderInitials()}
                </Avatar>
            </div>
        );
    }
}

export default ProfileAvatar;
