import _ from 'lodash';
import moment from '../utils/moment';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    CONTACT_LOCATION,
} from '../constants/trackerProperties';
import { mailto } from '../utils/contact';
import t from '../utils/gettext';
import tracker from '../utils/tracker';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DetailSection from './DetailSection';
import IconContainer from './IconContainer';
import InternalPropTypes from './InternalPropTypes';
import OfficeIcon from './OfficeIcon';
import MailIcon from './MailIcon';
import PhoneIcon from './PhoneIcon';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

class ProfileDetailContactInfo extends CSSComponent {

    static propTypes = {
        contactMethods: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
        ),
        isLoggedInUser: PropTypes.bool,
        locations: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.LocationV1),
        ),
        onClickLocation: PropTypes.func,
        profile: InternalPropTypes.ProfileV1.isRequired,
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
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
                Card: {
                    className: 'col-xs-12 col-sm-6 col-md-6 col-lg-6',
                    style: {
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
                },
                emptyValueIndicator: {
                    color: 'rgba(255, 0, 0, 0.7)',
                },
                IconContainer: {
                    stroke: 'rgba(0, 0, 0, .4)',
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
        if (props.locations && props.locations.length) {
            return moment().tz(props.locations[0].timezone);
        } else {
            return moment();
        }
    }

    // TODO move this to display_address on location
    getAddress(location) {
        return _.filter(
            [location.city, location.region],
            (item) => item !== null,
        ).join(', ');
    }

    getValue(contactItem) {
        if (!this.hasEmptyValue(contactItem)) {
            return contactItem.value;
        }

        switch (contactItem.contact_method_type) {
        case ContactMethodTypeV1.EMAIL:
            return t('Email not provided');
        case ContactMethodTypeV1.PHONE, ContactMethodTypeV1.CELL_PHONE, null:
            if (this.props.isLoggedInUser) {
                return t('Add Number');
            } else {
                return t('Number not added');
            }
        }
    }

    hasEmptyValue(contactItem) {
        return contactItem.value === '' || contactItem.value === null;
    }

    canCall(contactItem) {
        return this.context.device.mobileOS && contactItem.value.trim() !== ''
    }

    // Render Methods

    renderContactInfo() {
        const methods = this.props.contactMethods.map((item, index) => {
            if (!item) {
                return;
            }

            let shouldHighlight = this.props.isLoggedInUser && this.hasEmptyValue(item);
            let primaryTextStyle = shouldHighlight ? {...this.styles().emptyValueIndicator} : {};

            switch (item.contact_method_type) {
            case ContactMethodTypeV1.EMAIL:
                return (
                    <CardListItem
                        href={mailto(item.value)}
                        key={index}
                        leftAvatar={<IconContainer IconClass={MailIcon} {...this.styles().IconContainer} />}
                        onTouchTap={() => {
                            tracker.trackContactTap(
                                ContactMethodTypeV1.EMAIL,
                                this.props.profile,
                                CONTACT_LOCATION.PROFILE_DETAIL
                            );
                        }}
                        primaryText={this.getValue(item)}
                        primaryTextStyle={primaryTextStyle}
                        target="_blank"
                    />
                );
            case ContactMethodTypeV1.CELL_PHONE:
            case ContactMethodTypeV1.PHONE:
            // contact method type is null when it is the default value
            // (which is CELL_PHONE). this is filed here:
            // https://www.wunderlist.com/#/tasks/1500832524
            case null:
                return (
                    <CardListItem
                        disabled={!this.canCall(item)}
                        key={index}
                        leftAvatar={<IconContainer IconClass={PhoneIcon} {...this.styles().IconContainer} />}
                        onTouchTap={() => {
                            if (this.canCall(item)) {
                                tracker.trackContactTap(
                                    ContactMethodTypeV1.CELL_PHONE,
                                    this.props.profile,
                                    CONTACT_LOCATION.PROFILE_DETAIL
                                );
                                window.location.href = 'tel:' + item.value;
                            }
                        }}
                        primaryText={this.getValue(item)}
                        primaryTextStyle={primaryTextStyle}
                    />
                );
            }
        })
        return (
            <Card
                subTitle={t('Local Time') + ` \u2013 ` + this.state.currentTime.calendar()}
                title="Contact"
            >
                <CardList>
                    {methods}
                </CardList>
            </Card>
        );
    }

    renderLocations() {
        if (this.props.locations && this.props.locations.length) {
            const locations = this.props.locations.map((item, index) => {

                let secondaryText = `${this.getAddress(item)} `;
                if (item.profile_count === 1) {
                    secondaryText += `(${item.profile_count} Person)`;
                } else {
                    secondaryText += `(${item.profile_count} People)`;
                }

                return (
                    <CardListItem
                        key={index}
                        leftAvatar={<IconContainer IconClass={OfficeIcon} {...this.styles().IconContainer} />}
                        onTouchTap={this.props.onClickLocation.bind(null, item)}
                        primaryText={item.name}
                        secondaryText={secondaryText}
                    />
                );
            })
            return (
                <Card title={t('Works At')}>
                    <CardList>
                        {locations}
                    </CardList>
                </Card>
            );
        }

    }

    render() {
        return (
            <DetailSection
                {...this.props}
                firstCard={this.renderContactInfo()}
                secondCard={this.renderLocations()}
            />
        );
    }

}

export default ProfileDetailContactInfo;
