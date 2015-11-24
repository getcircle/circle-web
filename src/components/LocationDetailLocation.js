import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { iconColors } from '../constants/styles';
import moment from '../utils/moment';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import IconContainer from './IconContainer';
import EmbeddedGoogleMap from './EmbeddedGoogleMap';
import LocationIcon from './LocationIcon';

class LocationDetailLocation extends CSSComponent {

    static propTypes = {
        largerDevice: PropTypes.bool.isRequired,
        office: PropTypes.instanceOf(services.organization.containers.LocationV1),
    }

    static defaultProps = {
        largerDevice: false,
    }

    classes() {
        return {
            default: {
                AddressCardList: {
                    className: 'col-xs-12 col-sm-6 col-md-6 col-lg-6 first-sm first-md first-lg',
                },
                IconContainer: {
                    ...iconColors.medium,
                },
                MapCardList: {
                    className: 'col-xs-12 col-sm-6 col-md-6 col-lg-6 first-xs',
                    style: {
                        height: 150,
                    }
                },
            },
            'largerDevice-true': {
                map: {
                    position: 'absolute',
                },
                MapCardList: {
                    style: {
                        height: 'initial',
                        position: 'relative',
                    },
                },
            },
        };
    }

    getAddress(office) {
        let parts = [];
        if (office.address_1) {
            parts.push(office.address_1);
        }
        if (office.address_2) {
            parts.push(office.address_2);
        }
        return parts.join(', ');
    }

    getCityAndRegion(office) {
        let parts = [];
        if (office.city) {
            parts.push(office.city);
        }
        if (office.region) {
            parts.push(office.region);
        }
        return parts.join(', ');
    }

    getLocalTime(office) {
        return moment().tz(office.timezone).format('h:mm:ss a, MMMM Do YYYY');
    }

    renderAddressDetails(office) {
        let primaryText = this.getAddress(office);
        let secondaryText = this.getCityAndRegion(office);

        if (primaryText.trim().length === 0) {
            primaryText = secondaryText;
            secondaryText = undefined;
        }


        return (
            <CardList is="AddressCardList">
                <CardListItem
                    disabled={true}
                    key={0}
                    leftAvatar={<IconContainer IconClass={LocationIcon} is="IconContainer" />}
                    primaryText={primaryText}
                    secondaryText={secondaryText}
                />
            </CardList>
        );

    }

    renderMap(office) {
        return (
            <CardList is="MapCardList">
                <EmbeddedGoogleMap
                    height="100%"
                    is="map"
                    office={office}
                    width="100%"
                />
            </CardList>
        );

    }

    render() {
        const { office } = this.props;
        return (
            <Card {...this.props} title="Address">
                <CardRow>
                    {this.renderAddressDetails(office)}
                    {this.renderMap(office)}
                </CardRow>
            </Card>
        );
    }

}

export default LocationDetailLocation;
