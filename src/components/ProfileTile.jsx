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

    _getStyles() {
        return {
            paper: {
                textAlign: 'center',
                height: styleConstants.verticalRhythm * 20,
                position: 'relative',
                marginTop: styleConstants.verticalRhythm * 2,
            },
            avatar: {
                marginTop: styleConstants.verticalRhythm,
            },
            footer: {
                background: this.state.footerColor,
                height: styleConstants.verticalRhythm * 6,
                position: 'absolute',
                bottom: 0,
                width: '100%',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                lineHeight: '1em',
            },
            footerText: {
                padding: '.2em',
                maxHeight: '2.5em',
                overflowY: 'hidden',
                background: 'linear-gradient(rgba(255, 255, 255, 1) 0, rgba(255, 255, 255, 1) 2.1em, rgba(255, 255, 255, 0))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            },
        };
    }


    render() {
        const profile = this.props.profile;
        const styles = this._getStyles();
        // "Avatar" seems to be causing the page to load slowly since its fetching all the images at once. Is there a better way we can do this where the images will fade in as well?
        return (
            <Paper style={styles.paper}>
                <Avatar src={profile.image_url} style={styles.avatar} />
                <p>{profile.full_name}</p>
                <footer style={styles.footer}>
                    <div style={styles.footerText}>
                        {profile.title}
                    </div>
                </footer>
            </Paper>
        );
    }
}

export default ProfileTile;
