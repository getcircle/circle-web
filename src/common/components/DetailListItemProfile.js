import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import { routeToProfile } from '../utils/routes';
import Colors from '../styles/Colors';
import DetailListItem from './DetailListItem';
import ProfileAvatar from './ProfileAvatar';

class DetailListItemProfile extends DetailListItem {

    shouldComponentUpdate(nextProps, nextState) {
        const superChanged = super.shouldComponentUpdate(nextProps, nextState);
        const profileChanged = this.props.profile.id !== nextProps.profile.id;
        return profileChanged || superChanged;
    }

    handleTouchTap = () => {
        routeToProfile(this.props.profile);
    }

    getItem() {
        const { profile } = this.props;
        const styles = {
            avatar: {
                height: 50,
                width: 50,
                marginRight: 16,
            },
            innerDivStyle: {
                paddingLeft: 86,
                paddingRight: 50,
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
        const item = (
            <ListItem
                innerDivStyle={styles.innerDivStyle}
                leftAvatar={<ProfileAvatar profile={profile} style={styles.avatar} />}
                onTouchTap={this.handleTouchTap}
                primaryText={<span style={styles.primaryText}>{profile.full_name}</span>}
                secondaryText={<div style={styles.secondaryText}>{profile.title}</div>}
            />
        );
        return { item };
    }

}

const propTypes = Object.assign({}, DetailListItem.propTypes);
propTypes.profile = PropTypes.instanceOf(services.profile.containers.ProfileV1);

DetailListItem.propTypes = propTypes;

export default DetailListItemProfile;
