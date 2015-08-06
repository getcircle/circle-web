class ProfileActions {
    constructor() {
        this.generateActions(
            'loading',
            'fetchProfilesSuccess',
            'fetchProfilesError',
            'fetchExtendedProfileSuccess',
            'fetchExtendedProfileError',
            'fetchTagSuccess',
            'fetchTagError',
        );
    }
}

export default ProfileActions;
