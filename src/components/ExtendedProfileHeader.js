import mui from 'material-ui';
import React, { Component } from 'react';
import { services } from 'protobufs';

import moment from '../utils/moment';

import LocationIcon from './LocationIcon';
import TimeIcon from './TimeIcon';

const { Avatar } = mui;

const styles = {
    avatar: {
        height: 120,
        width: 120,
    },
    avatarSection: {
        paddingTop: 17,
    },
    infoContainer: {
        display: 'flex',
    },
    infoIcon: {
        height: 20,
        width: 20,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    infoIconStroke: {
        stroke: 'rgba(255, 255, 255, 0.5)',
    },
    infoLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 8,
    },
    infoSection: {
        paddingTop: 24,
    },
    locationContainer: {
        paddingLeft: 20,
    },
    name: {
        color: 'white',
        fontSize: '36px',
        fontWeight: 300,
    },
    nameSection: {
        paddingTop: 20,
    },
    root: {
        backgroundImage: 'linear-gradient(160deg,#4280c5 30%,#59f0ff 120%)',
        height: 360,
    },
    tenureContainer: {
        justifyContent: 'flex-end',
        paddingRight: 20,
    },
    timeIcon: {
        marginLeft: 28,
    },
    title: {
        textTransform: 'uppercase',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 500,
    },
    titleSection: {
        paddingTop: 10,
    },
};

class ExtendedProfileHeader extends Component {

    static propTypes = {
        location: React.PropTypes.instanceOf(services.organization.containers.LocationV1).isRequired,
        organization: React.PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
        profile: React.PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        team: React.PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
    }

    render() {
        const { 
            location,
            organization,
            profile,
            team,
        } = this.props;
        return (
            <header style={styles.root}>
                <div className="row" style={styles.infoSection}>
                    <div className="col-xs" style={Object.assign(
                        {},
                        styles.infoContainer,
                        styles.locationContainer,
                    )}>
                        <LocationIcon style={styles.infoIcon} stroke={styles.infoIconStroke.stroke} />
                        <span style={styles.infoLabel}>{`${location.city}, ${location.region}`}</span>
                        <TimeIcon style={Object.assign({},
                            styles.timeIcon,
                            styles.infoIcon,
                        )} stroke={styles.infoIconStroke.stroke} />
                        <span style={styles.infoLabel}>{moment().tz(location.timezone).calendar()}</span>
                    </div>
                    <div
                        className="col-xs"
                        style={Object.assign(
                            {},
                            styles.infoContainer,
                            styles.tenureContainer,
                        )}
                    >
                        <span style={styles.infoLabel}>{`\u2014 at ${organization.name} for ${moment(profile.hire_date).fromNow(true)}`}</span>
                    </div>
                </div>
                <div className="row center-xs" style={styles.avatarSection}>
                    <Avatar src={profile.image_url} style={styles.avatar} />
                </div>
                <div className="row center-xs" style={styles.nameSection}>
                    <span style={styles.name}>{profile.full_name}</span>
                </div>
                <div className="row center-xs" style={styles.titleSection}>
                    <span style={styles.title}>{profile.title} | {team.name}</span>
                </div>
            </header>
        );
    }

}

export default ExtendedProfileHeader;