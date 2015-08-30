import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { routeToProfile } from '../utils/routes';

import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import DetailMembers from './DetailMembers';
import DetailViewAll from './DetailViewAll';
import LocationDetailDescription from './LocationDetailDescription';
import LocationDetailHeader from './LocationDetailHeader';
import LocationDetailLocation from './LocationDetailLocation';

const { DescriptionV1 } = services.common.containers;

class LocationDetail extends CSSComponent {

    static propTypes = {
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
            return (
                <DetailMembers
                    actionText="View all Points of Contact"
                    is="section"
                    itemsPerColumn={1}
                    members={office.points_of_contact}
                    onClickMember={routeToProfile.bind(null, this.context.router)}
                    title="Points of Contact"
                />
            );
        }
    }

    handleClickAction() {
        this.refs.modal.show();
    }

    renderMembers(members) {
        if (members.length) {
            return (
                <DetailMembers
                    actionText="View all People"
                    is="section"
                    members={members}
                    onClickActionText={this.handleClickAction.bind(this)}
                    onClickMember={routeToProfile.bind(null, this.context.router)}
                    title="Works Here"
                />
            );
        }
    }

    render() {
        const { office, members } = this.props;
        let canEdit = office.permissions ? office.permissions.can_edit : false;

        return (
            <div>
                <LocationDetailHeader office={office} />
                <DetailContent>
                    <LocationDetailLocation office={office} />
                    {this.renderDescription(office, canEdit)}
                    {this.renderPointsOfContact(office)}
                    {this.renderMembers(members)}
                </DetailContent>
                <DetailViewAll
                    items={members}
                    onClickItem={routeToProfile.bind(null, this.context.router)}
                    ref="modal"
                    title={`Working at ${this.props.office.name}`}
                />
            </div>
        );
    }

}

export default LocationDetail;
