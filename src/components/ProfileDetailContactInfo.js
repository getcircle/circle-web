import _ from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import IconContainer from './IconContainer';
import OfficeIcon from './OfficeIcon';
import MailIcon from './MailIcon';
import PhoneIcon from './PhoneIcon';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

class ProfileDetailContactInfo extends CSSComponent {

    static propTypes = {
        contactMethods: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
        ),
        locations: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.LocationV1),
        ),
        onClickLocation: PropTypes.func,
    }

    classes() {
        return {
            default: {
                Card: {
                    className: 'col-xs-12 col-sm-6 col-md-6 col-lg-6',
                    style: {
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
                },
                IconContainer: {
                    stroke: 'rgba(0, 0, 0, .4)',
                },
            },
        };
    }

    // TODO move this to display_address on location
    getAddress(location) {
        return _.filter(
            [location.address_1, location.address_2, location.city, location.region],
            (item) => item !== null,
        ).join(', ');
    }

    renderContactInfo() {
        const methods = this.props.contactMethods.map((item, index) => {
            if (!item) {
                return;
            }
            switch (item.contact_method_type) {
            case ContactMethodTypeV1.EMAIL:
                return (
                    <CardListItem
                        disabled={true}
                        key={index}
                        leftAvatar={<IconContainer IconClass={MailIcon} is="IconContainer" />}
                        primaryText="Email"
                        secondaryText={item.value}
                    />
                );
            case ContactMethodTypeV1.PHONE, ContactMethodTypeV1.CELL_PHONE:
                return (
                    <CardListItem
                        disabled={true}
                        key={index}
                        leftAvatar={<IconContainer IconClass={PhoneIcon} is="IconContainer" />}
                        primaryText="Phone"
                        secondaryText={item.value}
                    />
                );
            }
        })
        return (
            <CardList>
                {methods}
            </CardList>
        );
    }

    renderLocations() {
        const locations = this.props.locations.map((item, index) => {
            return (
                <CardListItem
                    key={index}
                    leftAvatar={<IconContainer IconClass={OfficeIcon} is="IconContainer" />}
                    onTouchTap={this.props.onClickLocation.bind(null, item)}
                    primaryText={item.name}
                    secondaryText={this.getAddress(item)}
                />
            );
        })
        return (
            <CardList>
                {locations}
            </CardList>
        );

    }

    render() {
        return (
            <section {...this.props} >
                <CardRow>
                    <Card is="Card" title="Contact">
                        {this.renderContactInfo()}
                    </Card>
                    <Card is="Card" title="Works At">
                        {this.renderLocations()}
                    </Card>
                </CardRow>
            </section>
        );
    }

}

export default ProfileDetailContactInfo;
