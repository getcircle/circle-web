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
import LocationDetailHeader from './LocationDetailHeader';
import LocationDetailLocation from './LocationDetailLocation';
import ProfileAvatar from './ProfileAvatar';
import StyleableComponent from './StyleableComponent';

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
                <DetailContent>
                    <LocationDetailLocation office={office} />
                </DetailContent>
            </div>
        );
    }

}

export default LocationDetail;
