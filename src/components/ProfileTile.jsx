'use strict';

import _ from 'lodash';
import mui from 'material-ui';
import React from 'react';

import styleConstants from '../constants/styles';
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
        const colors = _.values(styleConstants.baseColors);
        this.setState({
            footerColor: colors[_.random(0, colors.length - 1)]
        })
    }

    render() {
        const profile = this.props.profile;
        const paperStyle = {
            textAlign: 'center',
            height: styleConstants.verticalRhythm * 20,
            position: 'relative',
            marginTop: styleConstants.verticalRhythm * 2,
        };
        const avatarStyle = {
            marginTop: styleConstants.verticalRhythm,
        };
        const footer = {
            background: this.state.footerColor,
            height: styleConstants.verticalRhythm * 6,
            position: 'absolute',
            bottom: 0,
            width: '100%',

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: '1em',
        };
        // "Avatar" seems to be causing the page to load slowly since its fetching all the images at once. Is there a better way we can do this where the images will fade in as well?
        return (
            <Paper style={paperStyle}>
                <Avatar src={profile.image_url} style={avatarStyle} />
                <p>{profile.full_name}</p>
                <footer style={footer}>{profile.title}</footer>
            </Paper>
        );
    }
}

export default ProfileTile;
