'use strict';

import profileFeedSource from '../sources/profileFeedSource';

class ProfileFeedStore {

	constructor() {
		this.registerAsync(profileFeedSource);
		this.bindActions(this.alt.getActions('ProfileFeedActions'));

		this.categories = [];
	}

	onSuccess(state) {
		this.setState(state);
	}

}

export default ProfileFeedStore;
