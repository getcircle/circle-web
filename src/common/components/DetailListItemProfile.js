import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import { routeToProfile } from '../utils/routes';
import Colors from '../styles/Colors';
import ProfileAvatar from './ProfileAvatar';

class DetailListItemProfile extends Component {

    shouldComponentUpdate(nextProps) {
        return this.props.profile.id !== nextProps.profile.id;
    }

    handleTouchTap = () => {
        routeToProfile(this.props.profile);
    }

    render() {
        const { profile, ...other } = this.props;
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
            <div {...other}>
                <ListItem
                    innerDivStyle={styles.innerDivStyle}
                    leftAvatar={<ProfileAvatar profile={profile} style={styles.avatar} />}
                    onTouchTap={this.handleTouchTap}
                    primaryText={<span style={styles.primaryText}>{profile.full_name}</span>}
                    secondaryText={<div style={styles.secondaryText}>{profile.title}</div>}
                />
            </div>
        );
    }
}

DetailListItemProfile.propTypes = {
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
};

export default DetailListItemProfile;
