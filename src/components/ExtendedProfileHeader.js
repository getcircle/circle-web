import React from 'react';
import { services } from 'protobufs';

import autoBind from '../utils/autoBind';
import moment from '../utils/moment';

import DetailHeader from './DetailHeader';
import LocationIcon from './LocationIcon';
import ProfileAvatar from './ProfileAvatar';
import StyleableComponent from './StyleableComponent';
import TimeIcon from './TimeIcon';

const styles = {
    avatar: {
        height: 120,
        width: 120,
        fontSize: '48px',
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
        fontWeight: 600,
    },
    titleSection: {
        paddingTop: 10,
        paddingBottom: 65,
    },
};

class ExtendedProfileHeader extends StyleableComponent {

    static propTypes = {
        location: React.PropTypes.instanceOf(services.organization.containers.LocationV1),
        organization: React.PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
        profile: React.PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        team: React.PropTypes.instanceOf(services.organization.containers.TeamV1),
    }

    state = {
        currentTime: null,
    }

    componentWillMount() {
        // update the current time every 60 seconds
        this._updateCurrentTime();
        // TODO we keep getting a warning about this I believe because "setState" isn't being called with a mounted component?
        setInterval(this._updateCurrentTime, 60000);
    }

    _updateCurrentTime = this._updateCurrentTime.bind(this)
    _updateCurrentTime() {
        this.setState({currentTime: moment().tz(this.props.location.timezone).calendar()})
    }

    _renderLocationInfo() {
        const { location } = this.props;
        if (location) {
            return (
                <div className="col-xs" style={this.mergeAndPrefix(
                    styles.infoContainer,
                    styles.locationContainer,
                )}>
                    <LocationIcon style={this.mergeAndPrefix(styles.infoIcon)} stroke={styles.infoIconStroke.stroke} />
                    <span style={this.mergeAndPrefix(styles.infoLabel)}>{`${location.city}, ${location.region}`}</span>
                    <TimeIcon style={this.mergeAndPrefix(
                        styles.timeIcon,
                        styles.infoIcon,
                    )} stroke={styles.infoIconStroke.stroke} />
                    <span style={this.mergeAndPrefix(styles.infoLabel)}>{this.state.currentTime}</span>
                </div>
            );
        }
    }

    render() {
        const { 
            organization,
            profile,
            team,
        } = this.props;
        return (
            <DetailHeader>
                <div className="row" style={this.mergeAndPrefix(styles.infoSection)}>
                    {this._renderLocationInfo()}
                    <div
                        className="col-xs"
                        style={this.mergeAndPrefix(
                            styles.infoContainer,
                            styles.tenureContainer,
                        )}
                    >
                        <span style={this.mergeAndPrefix(styles.infoLabel)}>{`\u2014 at ${organization.name} for ${moment(profile.hire_date).fromNow(true)}`}</span>
                    </div>
                </div>
                <div className="row center-xs" style={this.mergeAndPrefix(styles.avatarSection)}>
                    <ProfileAvatar style={this.mergeAndPrefix(styles.avatar)} profile={profile} />
                </div>
                <div className="row center-xs" style={this.mergeAndPrefix(styles.nameSection)}>
                    <span style={this.mergeAndPrefix(styles.name)}>{profile.full_name}</span>
                </div>
                <div className="row center-xs" style={styles.titleSection}>
                    <span style={this.mergeAndPrefix(styles.title)}>
                        {profile.title} {team && team.name ? `| ${team.name}` : '' }
                    </span>
                </div>
            </DetailHeader>
        );
    }

}

export default ExtendedProfileHeader;
