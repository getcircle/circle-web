import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import ProfileAvatar from './ProfileAvatar';
import StyleableComponent from './StyleableComponent';

const styles = {
    avatar: {
        fontSize: '16px',
    },
    avatarContainer: {
        paddingLeft: 10,
        alignSelf: 'center',
    },
    root: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 10,
    },
};

const MAX_PROFILES = 6;

class CardFooterProfiles extends StyleableComponent {

    static propTypes = {
        profiles: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1)
        ).isRequired,
    }

    render() {
        const { 
            profiles,
            style,
            ...other,
        } = this.props;
        const containers = profiles.slice(0, MAX_PROFILES).map((item, index) => {
            return (
                <div key={index} style={styles.avatarContainer}>
                    <ProfileAvatar profile={item} style={styles.avatar}/>
                </div>
            );
        })
        return (
            <div style={this.mergeAndPrefix(styles.root, style)} {...other}>
                {containers}
            </div>
        );
    }

}

export default CardFooterProfiles;
