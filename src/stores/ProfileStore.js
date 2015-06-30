'use strict';

import profileSource from '../sources/profileSource';

class ProfileStore {

    constructor() {
        this.registerAsync(profileSource);
        this.bindActions(this.alt.getActions('ProfileActions'));

        this.profiles = [];
        // XXX need to see if this is available to one component or to all components. If it is availlable to all it should be moved to the state
        this.nextRequest = null;
        // XXX this should be handled by the RequestsStore
        this.loading = false;
    }

    onGetProfilesSuccess(state) {
        // XXX not sure how we do setState if we want to append to the array
        this.profiles.push.apply(this.profiles, state.profiles || []);
        this.nextRequest = state.nextRequest;
        this.setState({loading: false});
    }

    onLoading(state) {
        // XXX should be moved to the RequestsStore
        this.setState({loading: true});
    }

    getProfilesError(state) {
        // XXX should be moved to the RequestsStore
        this.setState({loading: false});
    }

}

export default ProfileStore;
