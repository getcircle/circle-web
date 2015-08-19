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
import EmbeddedGoogleMap from './EmbeddedGoogleMap';
import LocationDetailHeader from './LocationDetailHeader';
import ProfileAvatar from './ProfileAvatar';
import StyleableComponent from './StyleableComponent';

// <EmbeddedGoogleMap style={this.styles.location} location={location} height="450" width="100%" />

const styles = {};

@decorate(Navigation)
class LocationDetail extends React.Component {

    static propTypes = {
        office: React.PropTypes.instanceOf(services.organization.containers.LocationV1).isRequired,
        members: React.PropTypes.arrayOf(React.PropTypes.instanceOf(services.profile.containers.ProfileV1)),
    }

    render() {
        const { office } = this.props;
        return (
            <div>
                <LocationDetailHeader office={office} />
            </div>
        );
    }

}

export default LocationDetail;
