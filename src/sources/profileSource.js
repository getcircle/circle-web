'use strict';

import { getProfiles } from '../services/profile';

const profileSource = (alt) => {
    return {

        getProfiles: {

            remote(state, nextRequest=null) {
                return getProfiles(nextRequest);
            },

            loading: alt.actions.ProfileActions.loading,
            success: alt.actions.ProfileActions.getProfilesSuccess,
            error: alt.actions.ProfileActions.getProfilesError,
        }

    };
};

export default profileSource;
