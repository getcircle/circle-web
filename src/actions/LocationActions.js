'use strict';

class LocationActions {
    constructor() {
        this.generateActions(
            'loading',
            'fetchLocationSuccess',
            'fetchLocationError',
            'fetchTeamsSuccess',
            'fetchTeamsError',
            'fetchProfilesSuccess',
            'fetchProfilesError',
        );
    }
}

export default LocationActions;
