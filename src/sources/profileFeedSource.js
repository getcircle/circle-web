'use strict';

import { getProfileFeed } from '../services/feed';

const profileFeedSource = (alt) => {
	return {

		getFeed: {

			remote(state) {
				return getProfileFeed();
			},

			// TODO see if we can proxy these through the RequestsActions as well so we trigger "start", "success", "fail"
			loading: alt.actions.ProfileFeedActions.loading,
			success: alt.actions.ProfileFeedActions.success,
			error: alt.actions.ProfileFeedActions.error,
		}

	};
};

export default profileFeedSource;
