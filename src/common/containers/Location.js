import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import {
    loadLocation,
    loadLocationMembers,
    updateLocation,
} from '../actions/locations';
import { resetScroll } from '../utils/window';
import { retrieveLocation, retrieveProfiles } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import PureComponent from '../components/PureComponent';
import LocationDetail from '../components/LocationDetail';

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.locationsSelector,
        selectors.responsiveSelector,
        selectors.routerParametersSelector,
        selectors.locationMembersSelector,
    ],
    (cacheState, locationsState, responsiveState, paramsState, membersState) => {
        let office, members, membersNextRequest;
        const locationId = paramsState.locationId;
        const cache = cacheState.toJS();
        if (locationsState.get('ids').has(locationId)) {
            office = retrieveLocation(locationId, cache);
        }
        if (membersState.has(locationId)) {
            const ids = membersState.get(locationId).get('ids').toJS();
            members = retrieveProfiles(ids, cache);
            membersNextRequest = membersState.get(locationId).get('nextRequest');
        }
        return {
            members,
            membersNextRequest,
            office,
            largerDevice: responsiveState.get('largerDevice'),
        };
    }
) ;

@connect(selector)
class Location extends PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        members: PropTypes.arrayOf(PropTypes.instanceOf(services.profile.containers.ProfileV1)),
        membersNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        // NB: This is named "office" bc "location" is used by react-router >.<
        office: PropTypes.instanceOf(services.organization.containers.LocationV1),
        params: PropTypes.object.isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.loadLocation(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.locationId !== this.props.params.locationId) {
            this.loadLocation(nextProps);
        }
    }

    loadLocation(props) {
        props.dispatch(loadLocation(props.params.locationId));
        this.loadLocationMembers(props);
        resetScroll();
    }

    loadLocationMembers(props) {
        props.dispatch(loadLocationMembers(props.params.locationId, props.membersNextRequest));
    }

    onUpdateLocation(location) {
        this.props.dispatch(updateLocation(location))
    }

    renderLocation() {
        const {
            office,
            members,
        } = this.props;
        if (office && members) {
            return (
                <LocationDetail
                    largerDevice={this.props.largerDevice}
                    members={members}
                    membersLoadMore={() => this.loadLocationMembers(this.props)}
                    office={office}
                    onUpdateLocationCallback={this.onUpdateLocation.bind(this)}
                />
            );
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container>
                {this.renderLocation()}
            </Container>
        );
    }
}

export default Location;
