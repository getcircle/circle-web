import React, { PropTypes } from 'react';

import { routeToProfile } from '../../utils/routes';
import moment from '../../utils/moment';

import ListItemProfile from '../ListItemProfile';

import t from '../../utils/gettext';

const Author = ({ post, ...other }, { muiTheme }) => {
    const profile = post.by_profile;
    const styles = {
        container: {
            padding: 0,
        },
        lastUpdated: {
            fontSize: '1.3rem',
            color: muiTheme.luno.colors.lightBlack,
            lineHeight: '1.6rem',
        },
    };
    const lastUpdated = moment(post.changed).fromNow()
    const primaryText = (
        <span style={styles.primaryText}>
            {profile.full_name}
            <span style={styles.lastUpdated}>
                {t(`\u2013 last updated ${lastUpdated}`)}
            </span>
        </span>
    );

    function handleTouchTap() { routeToProfile(profile); }

    return (
        <div style={styles.container} {...other}>
            <ListItemProfile
                onTouchTap={handleTouchTap}
                primaryText={primaryText}
                profile={profile}
            />
        </div>
    );
};

Author.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Author;
