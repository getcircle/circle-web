'use strict';

import _ from 'lodash';
import mui from 'material-ui';
import React from 'react';

import bindThis from '../utils/bindThis';
import constants from '../styles/constants';
import { getInitialsForProfile } from '../services/profile';
import { getRandomColor } from '../utils/avatars';
import t from '../utils/gettext';

import ProfileAvatar from './ProfileAvatar';
import TextFallbackAvatar from './TextFallbackAvatar';

const {
    List,
    ListDivider,
    ListItem,
} = mui;

class ExtendedProfile extends React.Component {

    static propTypes = {
        extendedProfile: React.PropTypes.object.isRequired,
    }

    constructor() {
        super();
        this.state = {
            imageSrc: null,
        };
    }

    componentWillMount() {
        const { profile } = this.props.extendedProfile;
        this.setState({imageSrc: profile.image_url});
    }

    styles = {
        sectionTitle: {
            color: '#666',
            fontSize: '16px',
            letterSpacing: '1px',
            paddingLeft: 0,
            paddingTop: 10,
            textTransform: 'uppercase',
            fontWeight: 'normal',
        },
        detailsContainer: {
            padding: '5px 0 30px 30px',
        },
        about: {
            paddingTop: 15,
            color: '#333',
            lineHeight: '30px',
        },
        image: {
            maxWidth: 300,
            maxHeight: 300,
        },
        placeHolderInitials: {
            height: '100%',
            width: '100%',
            fontSize: '100px',
            fontWeight: 300,
            color: constants.colors.lightText,
        },
        contactMethodsContainer: {
            width: '100%',
            marginTop: 20,
        },
    }

    @bindThis
    _handleImageError() {
        this.setState({imageSrc: null});
    }

    _renderContactMethods() {
        const { profile } = this.props.extendedProfile;
        let contactMethods = [{id: 'email', label: 'Email', 'value': profile.email}];
        contactMethods.push.apply(profile.contact_methods);
        contactMethods = _.filter(contactMethods, (contactMethod) => contactMethod.value !== '');

        const items = contactMethods.map((contactMethod, index) => {
            return (
                <ListItem key={index} secondaryText={contactMethod.label}>
                    {contactMethod.value}
                </ListItem>
            );
        });

        return (
            <div className="extended_profile__image" style={this.styles.contactMethodsContainer}>
                <List>
                    {items}
                </List>
            </div>
        );
    }

    _renderProfileImage() {
        const { profile } = this.props.extendedProfile;
        if (this.state.imageSrc) {
            return <img className="extended_profile__image" style={this.styles.image} src={profile.image_url} onError={this._handleImageError} />;
        } else {
            const style = _.assign(
                {},
                this.styles.image,
                {
                    height: 300,
                    width: 300,
                    backgroundColor: getRandomColor(profile.first_name),
                },
            );
            return (
                <div className="extended_profile__image" style={style}>
                    <span
                        className="content--center--h content--center--v"
                        style={this.styles.placeHolderInitials}
                    >
                        {getInitialsForProfile(profile)}
                    </span>
                </div>
            );
        }
    }

    _renderManager(manager) {
        if (manager) {
            return (
                <ListItem
                    leftAvatar={<ProfileAvatar profile={manager} />}
                    secondaryText={manager.title}
                >
                    {manager.full_name}
                </ListItem>
            );
        }
    }

    _renderTeam(team) {
        if (team) {
            return (
                <ListItem
                    leftAvatar={
                        <TextFallbackAvatar
                            style={this.styles.avatar}
                            fallbackText={team.name[0]}
                        />
                    }
                    secondaryText={team.department}
                >
                    {team.name}
                </ListItem>
            );
        }
    }

    _renderManagerAndTeam() {
        const {
            manager,
            team,
        } = this.props.extendedProfile;
        if (manager || team) {
            return (
                <List subheader={t('Manager and Team')} subheaderStyle={this.styles.sectionTitle}>
                    {this._renderManager(manager)}
                    {this._renderTeam(team)}
                </List>
            );
        }

    }

    _renderLocation() {
        const { location } = this.props.extendedProfile;
        if (location) {
            return (
                <List subheader={t('Location')} subheaderStyle={this.styles.sectionTitle}>
                    <ListItem
                        leftAvatar={
                            <TextFallbackAvatar
                                src={location.image_url}
                                style={this.styles.avatar}
                                fallbackText={location.name[0]}
                            />
                        }
                        secondaryText={`${location.profile_count} people`}
                    >
                        {location.name}
                    </ListItem>
                </List>
            );
        }
    }

    render() {
        // profile image
        // name
        // title
        // contact bar
        // about
        // hr
        // manager & team
        // hr
        // location
        // expertise
        // interests
        // key-value pairs
        // groups
        const {
            profile,
            manager,
            team,
            location,
        } = this.props.extendedProfile;

        return (
            <div className="wrap">
                <div className="row extended_profile">
                    <div className="col-sm-3">
                        {this._renderProfileImage()}
                        {this._renderContactMethods()}
                    </div>
                    <div className="col-sm-9" style={this.styles.detailsContainer}>
                        <div className="row start-xs">
                            <h1>{profile.full_name}</h1>
                        </div>
                        <div className="row start-xs">
                            <h2 className="content__header--secondary">{profile.title}</h2>
                        </div>
                        <div className="row start-xs">
                            <p style={this.styles.about}>{profile.about}</p>
                        </div>
                        {this._renderManagerAndTeam()}
                        {manager || team ? <ListDivider /> : null}
                        {this._renderLocation()}
                    </div>
                </div>
            </div>
        );
    }
}

export default ExtendedProfile;
