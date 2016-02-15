import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import { routeToProfile } from '../utils/routes';
import Colors from '../styles/Colors';
import ProfileAvatar from './ProfileAvatar';

class DetailListItemProfile extends Component {

    state = {
        hover: false,
    }

    shouldComponentUpdate(nextProps, nextState) {
        const profileChanged = this.props.profile.id !== nextProps.profile.id;
        const hoverChanged = this.state.hover !== nextState.hover;
        return profileChanged || hoverChanged;
    }

    handleMouseEnter = () => {
        this.setState({hover: true});
    }

    handleMouseLeave = () => {
        this.setState({hover: false});
    }

    handleTouchTap = () => {
        routeToProfile(this.props.profile);
    }

    render() {
        const { MenuComponent, onMenuChoice, profile, ...other } = this.props;
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
            root: {
                position: 'relative',
            },
            secondaryText: {
                fontSize: '13px',
                color: Colors.lightBlack,
            },
        };
        let menu;
        if (MenuComponent) {
            menu = (
                <MenuComponent
                    hover={this.state.hover}
                    onMenuChoice={onMenuChoice}
                    profile={profile}
                />
            );
        }
        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                style={styles.root}
                {...other}
            >
                <ListItem
                    innerDivStyle={styles.innerDivStyle}
                    leftAvatar={<ProfileAvatar profile={profile} style={styles.avatar} />}
                    onTouchTap={this.handleTouchTap}
                    primaryText={<span style={styles.primaryText}>{profile.full_name}</span>}
                    secondaryText={<div style={styles.secondaryText}>{profile.title}</div>}
                />

                {menu}
            </div>
        );
    }
}

DetailListItemProfile.propTypes = {
    MenuComponent: PropTypes.func,
    onMenuChoice: PropTypes.func,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
};

export default DetailListItemProfile;
