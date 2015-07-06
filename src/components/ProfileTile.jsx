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
            footer: {
                backgroundColor: colors[_.random(0, colors.length - 1)]
            }
        };
    }

    render() {
        const profile = this.props.profile;

        // "Avatar" seems to be causing the page to load slowly since its fetching all the images at once. Is there a better way we can do this where the images will fade in as well?
        return (
            <Paper className="profile-tile stack__item">
                <Avatar className="stack__item" src={profile.image_url} />
                <p className="stack__item">{profile.full_name}</p>
                <footer className="profile-tile__footer" style={this.styles.footer}>
                    <div className="profile-tile__footer__text">
                        {profile.title}
                    </div>
                </footer>
            </Paper>
        );
    }
}

export default ProfileTile;
