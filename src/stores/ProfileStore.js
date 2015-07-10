'use strict';

import profileSource from '../sources/profileSource';

class ProfileStore {

    constructor() {
        this.registerAsync(profileSource);
        this.bindActions(this.alt.getActions('ProfileActions'));

        this.extendedProfiles = {};
        this.profiles = {};
        this.profilesNextRequests = {};
        this.tags = {};

        // XXX this should be handled by the RequestsStore. Although we do want to have some concept of the store is loading vs. any random request is being sent.
        this.loading = false;
    }

    onFetchProfilesSuccess(state) {
        const tagId = state.parameters.tag_id || null;
        let {
            profiles,
            profilesNextRequests,
        } = this.getInstance().getState();
        let items = profiles[tagId];
        if (items === undefined) {
            items = [];
        }
        profiles[tagId] = items.concat(state.profiles);
        profilesNextRequests[tagId] = state.nextRequest;
        this.setState({
            profiles,
            profilesNextRequests,
            loading: false,
        });
    }

    onLoading(state) {
        // XXX should be moved to the RequestsStore
        this.setState({loading: true});
    }

    onFetchProfilesError(state) {
        // XXX should be moved to the RequestsStore
        this.setState({loading: false});
    }

    onFetchExtendedProfileSuccess(extendedProfile) {
        // XXX not sure if this is the best way to do this to ensure we're calling "setState"
        let extendedProfiles = this.getInstance().getState().extendedProfiles;
        extendedProfiles[extendedProfile.profile.id] = extendedProfile;
        this.setState({extendedProfiles});
    }

    onFetchTagSuccess(tag) {
        let { tags } = this.getInstance().getState();
        tags[tag.id] = tag;
        this.setState({tags});
    }

    static getExtendedProfile(profileId) {
        return this.getState().extendedProfiles[profileId];
    }

    static getProfilesForTagId(tagId) {
        tagId = tagId || null;
        return this.getState().profiles[tagId];
    }

    static getNextRequestForTagId(tagId) {
        return this.getState().profilesNextRequests[tagId];
    }

    static getTag(tagId) {
        return this.getState().tags[tagId];
    }

}

export default ProfileStore;
