import { services, soa } from 'protobufs';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { loadLocation, loadLocationMembers, updateLocation } from '../actions/locations';
import { retrieveLocation, retrieveProfiles } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import connectData from '../utils/connectData';
import { resetScroll } from '../utils/window';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import LocationDetail from '../components/LocationDetail';
import DocumentTitle from '../components/DocumentTitle';

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.locationsSelector,
        selectors.routerParametersSelector,
        selectors.locationMembersSelector,
    ],
    (cacheState, locationsState, paramsState, membersState) => {
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
        };
    }
);

function fetchLocation(dispatch, locationId, membersNextRequest) {
    return [
        dispatch(loadLocation(locationId)),
        dispatch(loadLocationMembers(locationId, membersNextRequest)),
    ];
}

function fetchData(getState, dispatch, location, params) {
    const { locationId } = params;
    return Promise.all(fetchLocation(dispatch, locationId));
}

@connectData(fetchData)
@connect(selector)
class Location extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        members: PropTypes.arrayOf(PropTypes.instanceOf(services.profile.containers.ProfileV1)),
        membersNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        // NB: This is named "office" bc "location" is used by react-router >.<
        office: PropTypes.instanceOf(services.organization.containers.LocationV1),
        params: PropTypes.object.isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.locationId !== this.props.params.locationId) {
            fetchLocation(nextProps.dispatch, nextProps.params.locationId);
            resetScroll();
        }
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
                <DocumentTitle title={office.name}>
                    <LocationDetail
                        members={members}
                        membersLoadMore={() => this.loadLocationMembers(this.props)}
                        office={office}
                        onUpdateLocationCallback={this.onUpdateLocation.bind(this)}
                    />
                </DocumentTitle>
            );
        } else {
            return (
                <DocumentTitle loading={true}>
                    <CenterLoadingIndicator />
                </DocumentTitle>
            );
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
