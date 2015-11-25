import _ from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import moment from '../utils/moment';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import DetailHeader from './DetailHeader';
import IconContainer from './IconContainer';
import OfficeIcon from './OfficeIcon';

class LocationDetailHeader extends CSSComponent {

    static propTypes = {
        largerDevice: PropTypes.bool.isRequired,
        office: PropTypes.instanceOf(services.organization.containers.LocationV1).isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    state = {
        currentTime: this.getCurrentTime(this.props),
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

    classes() {
        return {
            default: {
                icon: {
                    height: 80,
                    width: 80,
                    color: 'white',
                    strokeWidth: 1,
                },
                iconSection: {
                    position: 'relative',
                    paddingTop: '54px',
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
                    paddingTop: 5,
                },
                timeSection: {
                    paddingTop: 10,
                    paddingBottom: '56px',
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

    render() {
        const {
            largerDevice,
            office,
        } = this.props;
        let iconColor = {...this.styles().icon}.color;
        let iconStrokeWidth = {...this.styles().icon}.strokeWidth;
        return (
            <DetailHeader largerDevice={largerDevice}>
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
                        {t('Local Time')}&nbsp;{'\u2013'}&nbsp;
                        {this.state.currentTime.calendar()}
                    </span>
                </div>
            </DetailHeader>
        );
    }

}

export default LocationDetailHeader;
