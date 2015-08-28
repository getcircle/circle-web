import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { routeToProfile } from '../utils/routes';

import Card from './Card';
import CardRow from './CardRow';
import DetailContent from './DetailContent';
import DetailMembers from './DetailMembers';
import DetailViewAll from './DetailViewAll';
import LocationDetailHeader from './LocationDetailHeader';
import LocationDetailLocation from './LocationDetailLocation';
import StyleableComponent from './StyleableComponent';

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
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        members: [],
    }

    _renderDescription(office) {
        if (office.description) {
            return (
                <Card style={styles.section} title="Description">
                    <CardRow>
                        <span style={styles.description}>
                            {office.description.value}
                        </span>
                    </CardRow>
                </Card>
            );
        }
    }

    _renderPointsOfContact(office) {
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

    _handleClickAction() {
        this.refs.modal.show();
    }

    _renderMembers(members) {
        if (members.length) {
            return (
                <DetailMembers
                    actionText="View all People"
                    members={members}
                    onClickActionText={this._handleClickAction.bind(this)}
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
                    {this._renderDescription(office)}
                    {this._renderPointsOfContact(office)}
                    {this._renderMembers(members)}
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
