import _ from 'lodash';
import moment from '../utils/moment';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CSSComponent from './CSSComponent';
import DetailHeader from './DetailHeader';
import IconContainer from './IconContainer';
import MoonIcon from './MoonIcon';
import OfficeIcon from './OfficeIcon';
import SunIcon from './SunIcon';

class LocationDetailHeader extends CSSComponent {

    static propTypes = {
        office: PropTypes.instanceOf(services.organization.containers.LocationV1).isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.interval = null;
    }

    componentDidMount() {
        this.interval = setInterval(::this.updateCurrentTime, 60000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    state = {
        currentTime: this.getCurrentTime(this.props),
    }

    classes() {
        return {
            default: {
                DayNightIndicatorIcon: {
                    height: '28px',
                    width: '28px',
                },
                DayNightIndicatorIconContainer: {
                    stroke: 'rgba(255, 255, 255, 0.8)',
                },
                DayNightIndicatorIconContainerContainer: {
                    border: 0,
                    borderRadius: 0,
                    height: '28px',
                    left: 0,
                    position: 'relative',
                    top: 0,
                    right: 0,
                    width: '28px',
                },
                icon: {
                    height: 80,
                    width: 80,
                    color: 'white',
                    strokeWidth: 1,
                },
                iconSection: {
                    position: 'relative',
                    paddingTop: '5vh',
                },
                iconContainer: {
                    position: 'relative',
                    height: 120,
                    width: 120,
                    border: '1px solid white',
                    top: 0,
                    left: 0,
                },
                infoSection: {
                    paddingTop: 10,
                },
                nameSection: {
                    paddingTop: 20,
                },
                timeSection: {
                    paddingTop: 10,
                    paddingBottom: '5vh',
                },
            },
        };
    }

    updateCurrentTime() {
        const currentTime = this.getCurrentTime(this.props);
        if (currentTime) {
            this.setState({currentTime: this.getCurrentTime(this.props)});
        }
    }

    getCurrentTime(props) {
        if (props.office) {
            return moment().tz(props.office.timezone);
        }
    }

    // TODO move this to display_address on location
    getAddress(location) {
        return _.filter(
            [location.city, location.region],
            (item) => item !== null,
        ).join(', ');
    }


    getLocationInfo(location) {
        let parts = [];
        parts.push(this.getAddress(location));

        if (location.profile_count > 1) {
            parts.push(`(${location.profile_count} people)`);
        } else if (location.profile_count === 1) {
            parts.push(`${location.profile_count} person)`);
        }
        return parts.join(' ');
    }

    renderDayNightIndicatorImage() {
        let hour = this.state.currentTime.hour();
        let isDay = hour < 18 && hour >= 6;
        return (
            <IconContainer
                IconClass={isDay ? SunIcon : MoonIcon}
                iconStyle={{...this.styles().DayNightIndicatorIcon}}
                is="DayNightIndicatorIconContainer"
                style={{...this.styles().DayNightIndicatorIconContainerContainer}}
            />
        );
    }

    render() {
        const { office } = this.props;
        let iconColor = {...this.styles().icon}.color;
        let iconStrokeWidth = {...this.styles().icon}.strokeWidth;
        return (
            <DetailHeader img={office.image_url}>
                <div className="row center-xs" is="iconSection">
                    <IconContainer
                        IconClass={OfficeIcon}
                        iconStyle={{...this.styles().icon}}
                        is="iconContainer"
                        stroke={iconColor}
                        strokeWidth={iconStrokeWidth}
                    />
                </div>
                <div className="row center-xs" is="nameSection">
                    <span style={this.context.muiTheme.commonStyles.headerPrimaryText}>{office.name}</span>
                </div>
                <div className="row center-xs" is="infoSection">
                    <span style={this.context.muiTheme.commonStyles.headerSecondaryText}>{this.getLocationInfo(office)}</span>
                </div>
                <div className="row center-xs" is="timeSection">
                    <span style={this.context.muiTheme.commonStyles.headerTertiaryText}>
                        {this.renderDayNightIndicatorImage()}
                        {this.state.currentTime.calendar()}
                    </span>
                </div>
            </DetailHeader>
        );
    }

}

export default LocationDetailHeader;
