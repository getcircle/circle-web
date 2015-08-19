import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React from 'react';
import { services } from 'protobufs';

import moment from '../utils/moment';
import { routeToProfile, routeToTeam } from '../utils/routes';
import t from '../utils/gettext';

import Card from './Card';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import DetailContent from './DetailContent';
import DetailMembers from './DetailMembers';
import DetailViewAll from './DetailViewAll';
import LocationDetailHeader from './LocationDetailHeader';
import LocationDetailLocation from './LocationDetailLocation';
import ProfileAvatar from './ProfileAvatar';
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

@decorate(Navigation)
class LocationDetail extends React.Component {

    static propTypes = {
        office: React.PropTypes.instanceOf(services.organization.containers.LocationV1).isRequired,
        members: React.PropTypes.arrayOf(React.PropTypes.instanceOf(services.profile.containers.ProfileV1)),
    }

    static defaultProps = {
        members: [],
    }

    _renderDescription(office) {
        if (office.description) {
            return (
                <Card title="Description" style={styles.section}>
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
                    title="Points of Contact"
                    members={office.points_of_contact} 
                    actionText="View all Points of Contact"
                    perColumn={1}
                    onClickMember={routeToProfile.bind(this)}
                    style={styles.section}
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
                    title="Works Here"
                    members={members}
                    actionText="View all People"
                    onClickMember={routeToProfile.bind(this)}
                    style={styles.section}
                    onClickActionText={this._handleClickAction.bind(this)}
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
                    ref="modal"
                    title={`Working at ${this.props.office.name}`}
                    onClickItem={routeToProfile.bind(this)}
                    items={members}
                />
            </div>
        );
    }

}

export default LocationDetail;
