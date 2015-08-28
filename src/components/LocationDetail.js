import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { routeToProfile } from '../utils/routes';

import DetailContent from './DetailContent';
import DetailMembers from './DetailMembers';
import DetailViewAll from './DetailViewAll';
import LocationDetailDescription from './LocationDetailDescription';
import LocationDetailHeader from './LocationDetailHeader';
import LocationDetailLocation from './LocationDetailLocation';
import StyleableComponent from './StyleableComponent';

const { DescriptionV1 } = services.common.containers;

const styles = {
    description: {
        padding: 20,
        lineHeight: '24px',
        fontSize: '14px',
    },
    section: {
        marginTop: 20,
    },
};

class LocationDetail extends StyleableComponent {

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
                isEditable={isEditable}
                onSaveCallback={this.onUpdateDescription.bind(this)}
                style={this.mergeAndPrefix(styles.section)}
            />
        );
    }

    renderPointsOfContact(office) {
        if (office.points_of_contact && office.points_of_contact.length) {
            return (
                <DetailMembers
                    actionText="View all Points of Contact"
                    members={office.points_of_contact}
                    onClickMember={routeToProfile.bind(null, this.context.router)}
                    perColumn={1}
                    style={styles.section}
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
                    members={members}
                    onClickActionText={this.handleClickAction.bind(this)}
                    onClickMember={routeToProfile.bind(null, this.context.router)}
                    style={styles.section}
                    title="Works Here"
                />
            );
        }
    }

    render() {
        const { office, members } = this.props;
        return (
            <div>
                <LocationDetailHeader office={office} />
                <DetailContent>
                    <LocationDetailLocation office={office} />
                    {this.renderDescription(office, true)}
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
