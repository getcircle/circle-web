'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import bindThis from '../utils/bindThis';

const {
    Avatar,
    ListItem,
} = mui;

@decorate(Navigation)
class ProfileSearchResult extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        profile: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
        details: {
            display: 'block',
        },
    }

    @bindThis
    _handleTouchTap() {
        this.props.flux.getActions('SearchActions').clearResults();
        this.transitionTo(`/profile/${this.props.profile.id}`);
    }

    render() {
        const profile = this.props.profile;
        return (
            <ListItem
                leftAvatar={<Avatar src={profile.small_image_url || profile.image_url} />}
                onTouchTap={this._handleTouchTap}
            >
                {profile.full_name}
            </ListItem>
        );
    }

}

export default ProfileSearchResult;
