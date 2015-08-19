import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React from 'react';
import { services } from 'protobufs';

import { loadLocation, loadLocationMembers } from '../actions/locations';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import PureComponent from '../components/PureComponent';
import LocationDetail from '../components/LocationDetail';

const selector = createSelector(
    [
        selectors.locationsSelector,
        selectors.routerSelector,
        selectors.locationMembersSelector,
    ],
    (locationsState, routerState, membersState) => {
        return {
            office: locationsState.getIn(['objects', routerState.params.locationId]),
            members: membersState.getIn(['members', routerState.params.locationId]),
        }
    }
) ;

@connect(selector)
class Location extends PureComponent {

    static propTypes = {
        // NB: This is named "office" bc "location" is used by react-router >.<
        office: React.PropTypes.instanceOf(services.organization.containers.LocationV1),
        members: React.PropTypes.arrayOf(React.PropTypes.instanceOf(services.profile.containers.ProfileV1)),
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        this._fetchLocation(this.props);
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
            return <LocationDetail office={office} members={members} />;
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
