'use strict';

import _ from 'lodash';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import styleConstants from '../styles/constants';
import ThemeManager from '../utils/ThemeManager';

const {Avatar} = mui;
const {Paper} = mui;

@decorate(Navigation)
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

    _handleOnClick = this._handleOnClick.bind(this) 
    _handleOnClick(event) {
        this.transitionTo(`/profile/${this.props.profile.id}`);
    }

    render() {
        const profile = this.props.profile;

        // "Avatar" seems to be causing the page to load slowly since its fetching all the images at once. Is there a better way we can do this where the images will fade in as well?
        return (
            <Paper className="profile-tile stack__item" onClick={this._handleOnClick}>
                <Avatar className="stack__item" src={profile.small_image_url || profile.image_url} style={this.styles.avatar} />
                <p className="stack__item">{profile.full_name}</p>
                <p className="profile-title__text--secondary">{profile.title}</p>
            </Paper>
        );
    }
}

export default ProfileTile;
