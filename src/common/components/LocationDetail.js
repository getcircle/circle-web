import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { PAGE_TYPE } from '../constants/trackerProperties';
import { routeToProfile } from '../utils/routes';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import DetailMembers from './DetailMembers';
import LocationDetailHeader from './LocationDetailHeader';
import LocationDetailLocation from './LocationDetailLocation';

class LocationDetail extends CSSComponent {

    static propTypes = {
        members: PropTypes.arrayOf(PropTypes.instanceOf(services.profile.containers.ProfileV1)),
        membersLoadMore: PropTypes.func,
        office: PropTypes.instanceOf(services.organization.containers.LocationV1).isRequired,
        onUpdateLocationCallback: PropTypes.func.isRequired,
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

    // Render Methods

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
                    itemsPerColumn={1}
                    members={office.points_of_contact}
                    onClickMember={routeToProfile.bind(null, this.context.history)}
                    pageType={PAGE_TYPE.LOCATION_POINTS_OF_CONTACT}
                    style={this.styles().section}
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
                    members={members}
                    membersLoadMore={this.props.membersLoadMore}
                    onClickMember={routeToProfile}
                    pageType={PAGE_TYPE.LOCATION_MEMBERS}
                    style={this.styles().section}
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
            members,
            office,
        } = this.props;

        return (
            <div>
                <LocationDetailHeader office={office} />
                <DetailContent>
                    <LocationDetailLocation office={office} />
                    {this.renderPointsOfContact(office)}
                    {this.renderMembers(members, office.profile_count)}
                </DetailContent>
            </div>
        );
    }

}

export default LocationDetail;
