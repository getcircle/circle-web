import locationSource from '../sources/locationSource';

class LocationStore {

    constructor() {
        this.registerAsync(locationSource);
        this.bindActions(this.alt.getActions('LocationActions'));

        this.loading = false;
        this.organizationLocations = [];
        this.locations = {};
        this.locationProfiles = {};
        this.locationTeams = {};

        this.locationProfilesNextRequests = {};
        this.locationTeamsNextRequests = {};
    }

    onFetchLocationSuccess(location) {
        let { locations } = this.getInstance().getState();
        locations[location.id] = location;
        this.setState({locations});
    }

    onFetchLocationsSuccess(items) {
        let {
            locations,
            organizationLocations,
        } = this.getInstance().getState();
        // TODO this doesn't handle pagination, but neither does the service endpoint
        organizationLocations = items;
        items.forEach((location) => locations[location.id] = location);
        this.setState({
            locations,
            organizationLocations,
        });
    }

    onFetchProfilesSuccess(state) {
        let {
            locationProfiles,
            locationProfilesNextRequests,
        } = this.getInstance().getState();
        let profiles = locationProfiles[state.locationId];
        if (profiles === undefined) {
            profiles = [];
        }
        locationProfiles[state.locationId] = profiles.concat(state.profiles);
        locationProfilesNextRequests[state.locationId] = state.nextRequest;

        this.setState({locationProfiles, locationProfilesNextRequests});
    }

    onFetchTeamsSuccess(state) {
        let {
            locationTeams,
            locationTeamsNextRequests,
        } = this.getInstance().getState();
        let teams = locationTeams[state.locationId];
        if (teams === undefined) {
            teams = [];
        }
        locationTeams[state.locationId] = teams.concat(state.teams);
        locationTeamsNextRequests[state.locationId] = state.nextRequest;

        this.setState({locationTeams, locationTeamsNextRequests});
    }

    static getLocation(locationId) {
        return this.getState().locations[locationId];
    }

    static getProfiles(locationId) {
        return this.getState().locationProfiles[locationId];
    }

    static getTeams(locationId) {
        return this.getState().locationTeams[locationId];
    }

    static getProfilesNextRequest(locationId) {
        return this.getState().locationProfilesNextRequests[locationId];
    }

    static getTeamsNextRequest(locationId) {
        return this.getState().locationTeamsNextRequests[locationId];
    }

}

export default LocationStore;
