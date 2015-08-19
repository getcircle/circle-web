import React from 'react';
import { services } from 'protobufs';

import moment from '../utils/moment';

import Card from './Card';
import CardFooter from './CardFooter';
import CardFooterProfiles from './CardFooterProfiles';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import IconContainer from './IconContainer';
import EmbeddedGoogleMap from './EmbeddedGoogleMap';
import TimeIcon from './TimeIcon';
import LocationIcon from './LocationIcon';
import StyleableComponent from './StyleableComponent';

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
    map: {
        position: 'absolute',
    },
    mapContainer: {
        position: 'relative',
    },
};

class LocationDetailLocation extends StyleableComponent {

    static propTypes = {
        office: React.PropTypes.instanceOf(services.organization.containers.LocationV1),
    }

    _getAddress(office) {
        let parts = [];
        if (office.address_1) {
            parts.push(office.address_1);
        }
        if (office.address_2) {
            parts.push(office.address_2);
        }
        if (office.city) {
            parts.push(office.city);
        }
        if (office.region) {
            parts.push(office.region);
        }
        return parts.join(', ');
    }

    _getLocalTime(office) {
        return moment().tz(office.timezone).format('h:mm:ss a, MMMM Do YYYY');
    }

    _renderAddressDetails(office) {
        return (
            <CardList>
                <CardListItem
                    key={0}
                    primaryText="Address"
                    secondaryText={this._getAddress(office)}
                    leftAvatar={<IconContainer IconClass={LocationIcon} stroke={styles.icon.color} />}
                    disabled={true}
                />
                <CardListItem
                    key={1}
                    primaryText="Local Time"
                    secondaryText={this._getLocalTime(office)}
                    leftAvatar={<IconContainer IconClass={TimeIcon} stroke={styles.icon.color} />}
                    disabled={true}
                />
            </CardList>
        );

    }

    _renderMap(office) {
        return (
            <CardList style={styles.mapContainer}>
                <EmbeddedGoogleMap style={styles.map} office={office} height="100%" width="100%" />
            </CardList>
        );

    }

    render() {
        const { office } = this.props;
        return (
            <Card {...this.props} title="Location">
                <CardRow>
                    {this._renderAddressDetails(office)}
                    {this._renderMap(office)}
                </CardRow>
            </Card>
        );
    }

}

export default LocationDetailLocation;