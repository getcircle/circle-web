'use strict';

import {
    getExtendedProfile,
    getProfiles,
    getTag,
} from '../services/profile';

const profileSource = (alt) => {
    return {

        fetchProfiles: {

            remote(state, parameters, nextRequest) {
                return getProfiles(parameters, nextRequest);
            },

            local(state, parameters, nextRequest) {
                if (!nextRequest) {
                    return state.profiles[parameters.tag_id] ? state.profiles : null;
                }
            },

            loading: alt.actions.ProfileActions.loading,
            success: alt.actions.ProfileActions.fetchProfilesSuccess,
            error: alt.actions.ProfileActions.fetchProfilesError,
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

        fetchTag: {

            remote(state, tagId) {
                debugger;
                return getTag(tagId);
            },

            local(state, tagId) {
                return state.tags[tagId] ? state.tags : null;
            },

            loading: alt.actions.ProfileActions.loading,
            success: alt.actions.ProfileActions.fetchTagSuccess,
            error: alt.actions.ProfileActions.fetchTagError,
        },

    };
};

export default profileSource;
