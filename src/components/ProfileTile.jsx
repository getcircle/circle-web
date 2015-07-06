'use strict';

import _ from 'lodash';
import mui from 'material-ui';
import React from 'react';

import styleConstants from '../styles/constants';
import ThemeManager from '../utils/ThemeManager';

const {Avatar} = mui;
const {Paper} = mui;

class ProfileTile extends React.Component {

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        let colors = styleConstants.colors.bright;
        this.styles = {
            avatar: {
                width: '80px',
                height: '80px',
            },
        };
    }

    render() {
        const profile = this.props.profile;

        // "Avatar" seems to be causing the page to load slowly since its fetching all the images at once. Is there a better way we can do this where the images will fade in as well?
        return (
            <Paper className="profile-tile stack__item">
                <Avatar className="stack__item" src={profile.small_image_url || profile.image_url} style={this.styles.avatar} />
                <p className="stack__item">{profile.full_name}</p>
                <p className="profile-title__text--secondary">{profile.title}</p>
            </Paper>
        );
    }
}

export default ProfileTile;
