import _ from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import IconContainer from './IconContainer';
import OfficeIcon from './OfficeIcon';
import MailIcon from './MailIcon';
import PhoneIcon from './PhoneIcon';
import StyleableComponent from './StyleableComponent';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
};

class ExtendedProfileContactInfo extends StyleableComponent {

    static propTypes = {
        contactMethods: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
        ),
        locations: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.LocationV1),
        ),
        onClickLocation: PropTypes.func,
    }

    _getAddress(location) {
        return _.filter(
            [location.address_1, location.address_2, location.city, location.region],
            (item) => item !== null,
        ).join(', ');
    }

    _renderContactInfo() {
        const methods = this.props.contactMethods.map((item, index) => {
            switch (item.contact_method_type) {
            case ContactMethodTypeV1.EMAIL:
                return (
                    <CardListItem
                        key={index}
                        primaryText="Email"
                        secondaryText={item.value}
                        leftAvatar={<IconContainer IconClass={MailIcon} stroke={styles.icon.color}/>}
                        disabled={true}
                    />
                );
            case ContactMethodTypeV1.PHONE, ContactMethodTypeV1.CELL_PHONE:
                return (
                    <CardListItem
                        key={index}
                        primaryText="Phone"
                        secondaryText={item.value}
                        leftAvatar={<IconContainer IconClass={PhoneIcon} stroke={styles.icon.color}/>}
                        disabled={true}
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

    _renderLocations() {
        const locations = this.props.locations.map((item, index) => {
            return (
                <CardListItem
                    key={index}
                    primaryText={item.name}
                    secondaryText={this._getAddress(item)}
                    leftAvatar={<IconContainer IconClass={OfficeIcon} stroke={styles.icon.color} />}
                    onTouchTap={this.props.onClickLocation.bind(null, item)}
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
            <Card {...this.props} title="Contact">
                <CardRow>
                    {this._renderContactInfo()}
                    <CardVerticalDivider />
                    {this._renderLocations()}
                </CardRow>
            </Card>
        );
    }

}

export default ExtendedProfileContactInfo;
