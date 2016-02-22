import React, { PropTypes } from 'react';
import moment from '../../utils/moment';

import { ListItem } from 'material-ui';
import ProfileAvatar from '../ProfileAvatar';

import t from '../../utils/gettext';

const Author = ({ post, ...other }, { muiTheme }) => {
    const profile = post.by_profile;
    const styles = {
        container: {
            padding: 0,
        },
        innerDiv: {
            paddingBottom: 20,
            paddingTop: 24,
        },
        lastUpdated: {
            fontSize: '1.3rem',
            color: muiTheme.luno.colors.lightBlack,
            lineHeight: '1.6rem',
        },
        primaryText: {
            fontSize: '1.6rem',
            lineHeight: '1.9rem',
        },
        secondaryText: {
            fontSize: '1.3rem',
            color: muiTheme.luno.colors.lightBlack,
            marginTop: 5,
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

    const secondaryText = (
        <div>
            <span style={styles.secondaryText}>{profile.display_title}</span>
        </div>
    );

    return (
        <div style={styles.container} {...other}>
            <ListItem
                innerDivStyle={styles.innerDiv}
                leftAvatar={<ProfileAvatar profile={profile} style={muiTheme.luno.avatar}/>}
                primaryText={primaryText}
                secondaryText={secondaryText}
            />
        </div>
    );
};

Author.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Author;
