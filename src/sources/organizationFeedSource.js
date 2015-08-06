import { getOrganizationFeed } from '../services/feed';

const organizationFeedSource = (alt) => {
	return {

		getFeed: {

			remote(state) {
				return getOrganizationFeed();
			},

			loading: alt.actions.OrganizationFeedActions.loading,
			success: alt.actions.OrganizationFeedActions.success,
			error: alt.actions.OrganizationFeedActions.error,
		}
	};
};

export default organizationFeedSource;
