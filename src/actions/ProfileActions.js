'use strict';

class ProfileActions {
    constructor() {
        this.generateActions(
            'loading',
            'getProfilesSuccess',
            'getProfilesError',
            'fetchExtendedProfileSuccess',
            'fetchExtendedProfileError',
        );
    }
}

export default ProfileActions;
