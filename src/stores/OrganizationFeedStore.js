'use strict';

import organizationFeedSource from '../sources/organizationFeedSource';

class OrganizationFeedStore {

	constructor() {
		this.registerAsync(organizationFeedSource);
		this.bindActions(this.alt.getActions('OrganizationFeedActions'));

		this.categories = [];
	}

	onSuccess(state) {
		this.setState(state);
	}

}

export default OrganizationFeedStore;
