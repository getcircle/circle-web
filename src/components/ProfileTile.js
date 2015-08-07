import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import ProfileAvatar from '../components/ProfileAvatar';
import ThemeManager from '../utils/ThemeManager';

const { Paper } = mui;

@decorate(Navigation)
class ProfileTile extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    styles = {
        avatar: {
            width: '80px',
            height: '80px',
        },
        secondaryInfo: {
            margin: '10px 5px 10px 5px',
        },
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    _handleOnClick() {
        this.transitionTo(`/profile/${this.props.profile.id}`);
    }

    render() {
        const profile = this.props.profile;
        // "Avatar" seems to be causing the page to load slowly since its fetching all the images at once. Is there a better way we can do this where the images will fade in as well?
        return (
            <Paper className="profile-tile stack__item" onClick={this._handleOnClick.bind(this)}>
                <div className="row center-xs">
                    <ProfileAvatar className="stack__item" profile={profile} style={this.styles.avatar} />
                </div>
                <p className="content__header--primary stack__item">{profile.full_name}</p>
                <p className="content__header--secondary" style={this.styles.secondaryInfo}>{profile.title}</p>
            </Paper>
        );
    }
}

export default ProfileTile;
