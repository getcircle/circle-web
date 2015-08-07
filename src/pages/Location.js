import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React from 'react';

import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import LocationDetail from '../components/LocationDetail';

class Location extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        location: React.PropTypes.object,
        profiles: React.PropTypes.array,
        teams: React.PropTypes.array,
        profilesNextRequest: React.PropTypes.object,
        teamsNextRequest: React.PropTypes.object,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    static getStores(props) {
        return [props.flux.getStore('LocationStore')];
    }

    static getPropsFromStores(props) {
        const store = props.flux.getStore('LocationStore');
        const { locationId } = props.params;
        const locationProps = {
            location: store.getLocation(locationId),
            profiles: store.getProfiles(locationId),
            teams: store.getTeams(locationId),
            profilesNextRequest: store.getProfilesNextRequest(locationId),
            teamsNextRequest: store.getTeamsNextRequest(locationId),
        };

        return _.assign({}, locationProps);
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
        const store = props.flux.getStore('LocationStore');
        const { locationId } = props.params;
        store.fetchLocation(locationId);
        store.fetchProfiles(locationId);
        store.fetchTeams(locationId);
    }

    _renderLocation() {
        const {
            location,
            profiles,
            profilesNextRequest,
            teams,
            teamsNextRequest,
        } = this.props;
        if (location && profiles && teams) {
            return <LocationDetail
                        location={location}
                        profiles={profiles}
                        teams={teams}
                        profilesNextRequest={profilesNextRequest}
                        teamsNextRequest={teamsNextRequest}
                    />;
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <section className="wrap">
                {this._renderLocation()}
            </section>
        );
    }
}

export default Location;
