'use strict';

import {
    getLocation,
    getLocations,
    getTeamsForLocationId,
} from '../services/organization';

import { getProfilesForLocationId } from '../services/profile';

const locationSource = (alt) => {
    return {

        fetchLocation: {

            remote(state, locationId) {
                return getLocation(locationId);
            },

            local(state, locationId) {
                return state.locations[locationId] ? state.locations : null;
            },

            loading: alt.actions.LocationActions.loading,
            success: alt.actions.LocationActions.fetchLocationSuccess,
            error: alt.actions.LocationActions.fetchLocationError,
        },

        fetchLocations: {

            remote(state) {
                return getLocations();
            },

            local(state) {
                return state.organizationLocations.length ? state.organizationLocations : null;
            },

            loading: alt.actions.LocationActions.loading,
            success: alt.actions.LocationActions.fetchLocationsSuccess,
            error: alt.actions.LocationActions.fetchLocationsError,
        },

        fetchTeams: {

            remote(state, locationId) {
                return getTeamsForLocationId(locationId);
            },

            local(state, locationId) {
                return state.locationTeams[locationId] ? state.locationTeams : null;
            },

            loading: alt.actions.LocationActions.loading,
            success: alt.actions.LocationActions.fetchTeamsSuccess,
            error: alt.actions.LocationActions.fetchTeamsError,
        },

        fetchProfiles: {

            remote(state, locationId) {
                return getProfilesForLocationId(locationId);
            },

            local(state, locationId) {
                return state.locationProfiles[locationId] ? state.locationProfiles : null;
            },

            loading: alt.actions.LocationActions.loading,
            success: alt.actions.LocationActions.fetchProfilesSuccess,
            error: alt.actions.LocationActions.fetchProfilesError,
        },

    };
};

export default locationSource;
