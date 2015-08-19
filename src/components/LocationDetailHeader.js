import React from 'react';
import { services } from 'protobufs';

import DetailHeader from './DetailHeader';
import IconContainer from './IconContainer';
import OfficeIcon from './OfficeIcon';
import StyleableComponent from './StyleableComponent';

const styles = {
    icon: {
        height: 80,
        width: 80,
        color: 'white',
        strokeWidth: 1,
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
        paddingTop: 8,
    },
    info: {
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, .8)',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '17px',
    },
    locationIconSection: {
        position: 'relative',
        paddingTop: 60,
    },
    name: {
        color: 'white',
        fontSize: '36px',
        fontWeight: 300,
    },
    nameSection: {
        paddingTop: 20,
    },
};

class LocationDetailHeader extends StyleableComponent {

    static propTypes = {
        office: React.PropTypes.instanceOf(services.organization.containers.LocationV1).isRequired,
    }

    _getLocationInfo(location) {
        let parts = [];
        if (location.profile_count > 1) {
            parts.push(`${location.profile_count} people`);
        } else if (location.profile_count === 1) {
            parts.push(`${location.profile_count} person`);
        }
        return parts.join(',');
    }

    render() {
        const { office } = this.props;
        return (
            <DetailHeader>
                <div className="row center-xs" style={styles.locationIconSection}>
                    <IconContainer
                        style={styles.iconContainer}
                        IconClass={OfficeIcon}
                        iconStyle={styles.icon}
                        stroke={styles.icon.color}
                        strokeWidth={styles.icon.strokeWidth}
                    />
                </div>
                <div className="row center-xs" style={styles.nameSection}>
                    <span style={styles.name}>{office.name}</span>
                </div>
                <div className="row center-xs" style={styles.infoSection}>
                    <span style={styles.info}>{this._getLocationInfo(office)}</span>
                </div>
            </DetailHeader>
        );
    }

}

export default LocationDetailHeader;