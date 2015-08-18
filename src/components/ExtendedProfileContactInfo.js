import _ from 'lodash';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React, { Component } from 'react';
import { services } from 'protobufs';

import autoBind from '../utils/autoBind';

import Card from './Card';
import CardListItem from './CardListItem';
import CardVerticalDivider from './CardVerticalDivider';
import IconContainer from './IconContainer';
import OfficeIcon from './OfficeIcon';
import MailIcon from './MailIcon';
import PhoneIcon from './PhoneIcon';

const {
    List,
    ListItem,
} = mui;

const { StylePropable } = mui.Mixins;
const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

const styles = {
    icon: {
        color: 'rgba(0, 0, 0, .4)',
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    row: {
        width: '100%',
    },
};

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class ExtendedProfileContactInfo extends Component {

    static propTypes = {
        locations: React.PropTypes.arrayOf(
            React.PropTypes.instanceOf(services.organization.containers.LocationV1),
        ),
        contactMethods: React.PropTypes.arrayOf(
            React.PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
        ),
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
            <List className="col-xs" style={styles.list}>
                {methods}
            </List>
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
                />
            );
        })
        return (
            <List className="col-xs" style={styles.list}>
                {locations}
            </List>
        );

    }

    render() {
        return (
            <Card {...this.props} title="Contact">
                <div className="row" style={this.mergeAndPrefix(styles.row)}>
                    {this._renderContactInfo()}
                    <CardVerticalDivider />
                    {this._renderLocations()}
                </div>
            </Card>
        );
    }

}

export default ExtendedProfileContactInfo;
