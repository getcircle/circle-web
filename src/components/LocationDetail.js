import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { PAGE_TYPE } from '../constants/trackerProperties';
import { routeToProfile } from '../utils/routes';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import DetailMembers from './DetailMembers';
import LocationDetailDescription from './LocationDetailDescription';
import LocationDetailHeader from './LocationDetailHeader';
import LocationDetailLocation from './LocationDetailLocation';

const { DescriptionV1 } = services.common.containers;

class LocationDetail extends CSSComponent {

    static propTypes = {
        largerDevice: PropTypes.bool.isRequired,
        members: PropTypes.arrayOf(PropTypes.instanceOf(services.profile.containers.ProfileV1)),
        office: PropTypes.instanceOf(services.organization.containers.LocationV1).isRequired,
        onUpdateLocationCallback: PropTypes.func.isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        members: [],
    }

    classes() {
        return {
            default: {
                description: {
                    padding: 20,
                    lineHeight: '24px',
                    fontSize: '14px',
                },
                section: {
                    marginTop: 20,
                },
            },
        };
    }

    // Update Methods

    onUpdateDescription(descriptionText) {
        const {
            office,
            onUpdateLocationCallback,
        } = this.props;

        let locationDescriptionV1 = new DescriptionV1({
            value: descriptionText,
        });

        let updatedLocation = Object.assign({}, office, {
            description: locationDescriptionV1,
        });

        onUpdateLocationCallback(updatedLocation);
    }

    // Render Methods

    renderDescription(office, isEditable) {
        return (
            <LocationDetailDescription
                description={office.description}
                is="section"
                isEditable={isEditable}
                onSaveCallback={this.onUpdateDescription.bind(this)}
            />
        );
    }

    renderPointsOfContact(office) {
        if (office.points_of_contact && office.points_of_contact.length) {

            let title = `${t('Points of Contact')} (${office.points_of_contact.length})`;
            let actionText = '';
            if (office.points_of_contact.length === 1) {
                actionText = 'View 1 Point of Contact';
            } else {
                actionText = `View all ${office.points_of_contact} Points of Contact`;
            }

            return (
                <DetailMembers
                    actionText={actionText}
                    is="section"
                    itemsPerColumn={1}
                    members={office.points_of_contact}
                    onClickMember={routeToProfile.bind(null, this.context.router)}
                    pageType={PAGE_TYPE.LOCATION_POINTS_OF_CONTACT}
                    title={title}
                />
            );
        }
    }

    renderMembers(members, totalMembersCount) {
        if (members.length) {

            let title = `${t('People')} (${totalMembersCount})`;
            let actionText = '';
            if (totalMembersCount.length === 1) {
                actionText = 'View 1 Person';
            } else {
                actionText = `View all ${totalMembersCount} People`;
            }

            return (
                <DetailMembers
                    actionText={actionText}
                    is="section"
                    largerDevice={this.props.largerDevice}
                    members={members}
                    onClickMember={routeToProfile.bind(null, this.context.router)}
                    pageType={PAGE_TYPE.LOCATION_MEMBERS}
                    title={title}
                    viewAllAttribute={services.search.containers.search.AttributeV1.LOCATION_ID}
                    viewAllAttributeValue={this.props.office.id}
                    viewAllFilterPlaceholderText="Search People"
                    viewAllTitle={`People (${totalMembersCount})`}
                />
            );
        }
    }

    render() {
        const {
            largerDevice,
            members,
            office,
        } = this.props;
        let canEdit = office.permissions ? office.permissions.can_edit : false;
        return (
            <div>
                <LocationDetailHeader office={office} />
                <DetailContent>
                    <LocationDetailLocation largerDevice={largerDevice} office={office} />
                    {this.renderDescription(office, canEdit)}
                    {this.renderPointsOfContact(office)}
                    {this.renderMembers(members, office.profile_count)}
                </DetailContent>
            </div>
        );
    }

}

export default LocationDetail;
