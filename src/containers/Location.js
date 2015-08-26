import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { loadLocation, loadLocationMembers, retrieveLocation, retrieveLocationMembers } from '../actions/locations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import PureComponent from '../components/PureComponent';
import LocationDetail from '../components/LocationDetail';

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.locationsSelector,
        selectors.routerParametersSelector,
        selectors.locationMembersSelector,
    ],
    (cacheState, locationsState, paramsState, membersState) => {
        let office, members;
        const locationId = paramsState.locationId;
        const cache = cacheState.toJS();
        if (locationsState.get('ids').has(locationId)) {
            office = retrieveLocation(locationId, cache);
        }
        if (membersState.has(locationId) && !membersState.get(locationId).get('loading')) {
            const ids = membersState.get(locationId).get('ids').toJS();
            members = retrieveLocationMembers(ids, cache);
        }
        return {office: office, members: members};
    }
) ;

@connect(selector)
class Location extends PureComponent {

    static propTypes = {
        members: PropTypes.arrayOf(PropTypes.instanceOf(services.profile.containers.ProfileV1)),
        // NB: This is named "office" bc "location" is used by react-router >.<
        office: PropTypes.instanceOf(services.organization.containers.LocationV1),
        params: PropTypes.object.isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this._fetchLocation(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.locationId !== this.props.params.locationId) {
            this._fetchLocation(nextProps);
        }
    }

    _fetchLocation(props) {
        props.dispatch(loadLocation(props.params.locationId));
        props.dispatch(loadLocationMembers(props.params.locationId));
    }

    _renderLocation() {
        const {
            office,
            members,
        } = this.props;
        if (office && members) {
            return (
                <LocationDetail
                    members={members}
                    office={office}
                />
            );
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container>
                {this._renderLocation()}
            </Container>
        );
    }
}

export default Location;
