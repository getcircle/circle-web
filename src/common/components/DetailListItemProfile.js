import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import Colors from '../styles/Colors';
import ProfileAvatar from './ProfileAvatar';

const DetailListItemProfile = ({ profile }) => {
    const styles = {
        avatar: {
            height: 50,
            width: 50,
            marginRight: 16,
        },
        innerDivStyle: {
            paddingLeft: 86,
        },
        primaryText: {
            fontSize: '16px',
            lineHeight: '19px',
        },
        secondaryText: {
            fontSize: '13px',
            color: Colors.lightBlack,
        },
    };
    return (
        <ListItem
            innerDivStyle={styles.innerDivStyle}
            leftAvatar={<ProfileAvatar profile={profile} style={styles.avatar} />}
            primaryText={<span style={styles.primaryText}>{profile.full_name}</span>}
            secondaryText={<div style={styles.secondaryText}>{profile.title}</div>}
        />
    );
};

DetailListItemProfile.propTypes = {
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
};

export default DetailListItemProfile;
