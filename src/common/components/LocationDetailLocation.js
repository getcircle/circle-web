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
import InternalPropTypes from './InternalPropTypes';
import EmbeddedGoogleMap from './EmbeddedGoogleMap';
import LocationIcon from './LocationIcon';

class LocationDetailLocation extends CSSComponent {

    static propTypes = {
        office: PropTypes.instanceOf(services.organization.containers.LocationV1),
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
    }

    styles() {
        return this.css({
            largerDevice: this.context.device.largerDevice,
        });
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
            'largerDevice': {
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
            <CardList {...this.styles().AddressCardList}>
                <CardListItem
                    disabled={true}
                    key={0}
                    leftAvatar={<IconContainer IconClass={LocationIcon} {...this.styles().IconContainer} />}
                    primaryText={primaryText}
                    secondaryText={secondaryText}
                />
            </CardList>
        );

    }

    renderMap(office) {
        return (
            <CardList {...this.styles().MapCardList}>
                <EmbeddedGoogleMap
                    height="100%"
                    office={office}
                    style={this.styles().map}
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
