'use strict';

class LocationActions {
    constructor() {
        this.generateActions(
            'loading',
            'fetchLocationSuccess',
            'fetchLocationError',
            'fetchLocationsSuccess',
            'fetchLocationsError',
            'fetchTeamsSuccess',
            'fetchTeamsError',
            'fetchProfilesSuccess',
            'fetchProfilesError',
        );
    }
}

export default LocationActions;
