'use strict';

import { getProfiles } from '../services/profile';
import { getExtendedProfile } from '../services/profile';

const profileSource = (alt) => {
    return {

        getProfiles: {

            remote(state, nextRequest=null) {
                return getProfiles(nextRequest);
            },

            loading: alt.actions.ProfileActions.loading,
            success: alt.actions.ProfileActions.getProfilesSuccess,
            error: alt.actions.ProfileActions.getProfilesError,
        },

        fetchExtendedProfile: {

            remote(state, profileId) {
                return getExtendedProfile(profileId);
            },

            local(state, profileId) {
                return state.extendedProfiles[profileId] ? state.extendedProfiles : null;
            },

            loading: alt.actions.ProfileActions.loading,
            success: alt.actions.ProfileActions.fetchExtendedProfileSuccess,
            error: alt.actions.ProfileActions.fetchExtendedProfileError,
        },

    };
};

export default profileSource;
